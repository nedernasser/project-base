import {IUseCase} from 'src/core/usecase'
import {Result} from 'src/core/result'
import {inject, singleton} from 'tsyringe'
import {IUserService, UserDTO, UserService} from 'src/services/user/user.service'
import {ITokenService, TokenService} from 'src/services/token/token.service'

export type IUserPostUseCase = IUseCase<UserDTO, bigint>

@singleton<IUserPostUseCase>()
export class UserPostUseCase implements IUserPostUseCase {
  constructor(
    @inject(UserService) private userService: IUserService,
    @inject(TokenService) private tokenService: ITokenService
  ) {}

  async exec(data: UserDTO): Promise<Result<bigint>> {
    data.totpKey = await this.tokenService.generateSecret()
    return this.userService.create(data)
  }
}
