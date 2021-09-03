import jwt, {JwtPayload} from 'jsonwebtoken'
import crypto from 'crypto'
import * as Buffer from 'buffer'
import {inject, injectable} from 'tsyringe'
import {IRedisCli, RedisCli} from '@lib/redis'
import {Result} from 'src/core/result'
import {ErrorCode} from 'src/const/error'

export default interface JWTToken {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface IJWTService {
  // eslint-disable-next-line @typescript-eslint/ban-types
  generate(data: object): Promise<JWTToken>
  validate(token: string): Result<JwtPayload>
  refresh(opaqueToken: string): Promise<Result<JWTToken>>
}

@injectable()
export class JWTService implements IJWTService {
  private readonly JWT_EXPIRATION_MS = 60 * 15 * 1000
  private readonly RANDOM_BYTES_SIZE = 48

  constructor(@inject(RedisCli) private redisCli: IRedisCli) {}

  generate(data: any): Promise<JWTToken> {
    return this.generateJWT(data)
  }

  validate(token: string): Result<JwtPayload> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload
      return Result.ok(decoded)
    } catch (err) {
      return Result.fail(err)
    }
  }

  async refresh(opaqueToken: string): Promise<Result<JWTToken>> {
    const data = await this.redisCli.get(opaqueToken)
    await this.redisCli.delete(opaqueToken)

    if (!data) {
      return Result.fail(ErrorCode.UNAUTHORIZED_ERROR)
    } else {
      return Result.ok(await this.generateJWT(JSON.parse(data)))
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private async generateJWT(data: object): Promise<JWTToken> {
    const accessToken = jwt.sign({data}, process.env.JWT_SECRET as string, {
      expiresIn: `${this.JWT_EXPIRATION_MS}ms`,
      algorithm: 'HS512'
    })

    const refreshToken = await this.generateOpaqueToken(data)

    return {
      accessToken,
      refreshToken,
      expiresIn: this.JWT_EXPIRATION_MS
    }
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  private generateOpaqueToken(data: object): Promise<string> {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(this.RANDOM_BYTES_SIZE, async (err: Error, buffer: Buffer) => {
        if (err) {
          reject(err)
        } else {
          const opaqueToken = buffer.toString('hex')
          await this.redisCli.set(opaqueToken, JSON.stringify(data), 60 * 60 * 24 * 2)

          resolve(opaqueToken)
        }
      })
    })
  }
}
