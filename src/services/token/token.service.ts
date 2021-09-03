import {singleton} from 'tsyringe'
import {authenticator} from 'otplib'
import {Authenticator} from '@otplib/core'

export interface ITokenService {
  generate(secret: string): Promise<string>
  generateSecret(): Promise<string>
  validate(secret: string, token: string): Promise<boolean>
}

@singleton<ITokenService>()
export class TokenService implements ITokenService {
  private readonly _authenticator: Authenticator

  constructor() {
    this._authenticator = authenticator.clone({
      window: 3
    })
  }

  async generateSecret(): Promise<string> {
    return this._authenticator.generateSecret()
  }

  async generate(secret: string): Promise<string> {
    return this._authenticator.generate(secret)
  }

  async validate(secret: string, token: string): Promise<boolean> {
    return this._authenticator.verify({
      token,
      secret
    })
  }
}
