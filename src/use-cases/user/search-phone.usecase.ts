import {IUseCase} from 'src/core/usecase'
import {Result} from 'src/core/result'
import {inject, singleton} from 'tsyringe'
import {IUserService, UserDTO, UserService} from 'src/services/user/user.service'

export type IUserSearchPhoneUseCase = IUseCase<any, UserDTO | null>

@singleton<IUserSearchPhoneUseCase>()
export class UserSearchPhoneUseCase implements IUserSearchPhoneUseCase {
  constructor(@inject(UserService) private userService: IUserService) {}

  async exec(data: any): Promise<Result<UserDTO | null>> {
    return await this.userService.findByPhone(data.phone)
  }
}
