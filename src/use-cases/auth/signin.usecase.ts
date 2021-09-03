import {IUseCase} from 'src/core/usecase'
import JWTToken, {IJWTService, JWTService} from '@services/token/jwt.service'
import {Result} from 'src/core/result'
import {inject, singleton} from 'tsyringe'
import {ErrorCode} from 'src/const/error'
import {ITokenService, TokenService} from 'src/services/token/token.service'
import {IUserService, UserService} from 'src/services/user/user.service'

export enum SignInModeEnum {
  MOBILE = 'MOBILE',
  SELLER = 'SELLER'
}

export interface SignInUseCaseDTO {
  user: string
  password: string
  mode: SignInModeEnum
}

export type ISignInUseCase = IUseCase<SignInUseCaseDTO, JWTToken>

@singleton<ISignInUseCase>()
export class SignInUseCase implements ISignInUseCase {
  constructor(
    @inject(TokenService) private tokenService: ITokenService,
    @inject(JWTService) private jwtService: IJWTService,
    @inject(UserService) private userService: IUserService
  ) {}

  async exec(data: SignInUseCaseDTO): Promise<Result<JWTToken>> {
    const userResult = await this.userService.findByPhone(data.user)
    let secret = process.env.TOTP_SECRET as string

    if (userResult.isSuccess) {
      secret = userResult.getValue()?.totpKey as string
    }

    const result = await this.tokenService.validate(secret, data.password)

    if (result) {
      const jwtPayload: any = {
        user: data.user
      }

      if (userResult.isSuccess) {
        const user = userResult.getValue()
        jwtPayload.userId = user?.id
      }

      const token = await this.jwtService.generate(jwtPayload)

      return Result.ok(token)
    }

    return Result.fail(ErrorCode.UNAUTHORIZED_ERROR)
  }
}
