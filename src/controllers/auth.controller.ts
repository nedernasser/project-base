import {Controller, POST} from 'fastify-decorators'
import {container} from 'tsyringe'
import {IRefreshTokenUseCase, RefreshTokenUseCase, RefreshTokenUseCaseDTO} from 'src/use-cases/auth/refresh-token.usecase'
import {ISignInUseCase, SignInUseCase} from 'src/use-cases/auth/signin.usecase'
import { FastifyReply, FastifyRequest } from 'fastify'

@Controller('/auth')
export default class AuthController {
  private readonly refreshTokenUseCase: IRefreshTokenUseCase
  private readonly signInUseCase: ISignInUseCase

  constructor() {
    this.refreshTokenUseCase = container.resolve<IRefreshTokenUseCase>(RefreshTokenUseCase)
    this.signInUseCase = container.resolve<ISignInUseCase>(SignInUseCase)
  }

  @POST('/signin')
  async signInHandler(req: FastifyRequest<any>, res: FastifyReply): Promise<void> {
    const result = await this.signInUseCase.exec(req.body)
    result.send(200, res)
  }

  @POST('/refreshtoken')
  async refreshTokenHandler(req: FastifyRequest<any>, res: FastifyReply): Promise<void> {
    const result = await this.refreshTokenUseCase.exec(req.body)
    result.send(200, res)
  }
}
