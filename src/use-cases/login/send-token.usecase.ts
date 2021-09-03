import {inject, singleton} from 'tsyringe'

import {ITokenService, TokenService} from '@services/token/token.service'
import {INotifymeService, NotifymeService} from '@external/notifyme.service'
import {IUseCase} from 'src/core/usecase'
import {IUserService, UserService} from 'src/services/user/user.service'

export interface SendTokenDTO {
  phone: string
}

export type ISendTokenUseCase = IUseCase<SendTokenDTO, any>

@singleton<ISendTokenUseCase>()
export class SendTokenUseCase implements ISendTokenUseCase {
  constructor(
    @inject(TokenService) private tokenService: ITokenService,
    @inject(NotifymeService) private notifymeService: INotifymeService,
    @inject(UserService) private userService: IUserService
  ) {}

  async exec(sendTokenDTO: SendTokenDTO): Promise<any> {
    const user = await this.userService.findByPhone(sendTokenDTO.phone)
    let secret = process.env.TOTP_SECRET as string

    if (user.isSuccess) {
      secret = user.getValue()?.totpKey as string
    }

    const token = await this.tokenService.generate(secret)
    const message = {message: `Olá, utilize a chave ${token} para iniciar sua jornada na Sami :)`}

    return this.notifymeService.sendSMS({...sendTokenDTO, ...message})
  }
}
