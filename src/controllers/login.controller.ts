import {container} from 'tsyringe'
import {Controller, POST} from 'fastify-decorators'
import {ISendTokenUseCase, SendTokenDTO, SendTokenUseCase} from '../use-cases/login/send-token.usecase'

@Controller('/auth')
export default class LoginController {
  private readonly sendTokenUseCase: ISendTokenUseCase

  constructor() {
    this.sendTokenUseCase = container.resolve<ISendTokenUseCase>(SendTokenUseCase)
  }

  @POST('/sms/send-token')
  async sendToken(req, res) {
    const sendTokenDTO: SendTokenDTO = req.body
    const login = await this.sendTokenUseCase.exec(sendTokenDTO)

    login.send(204, res)
  }
}
