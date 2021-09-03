import {Controller, GET} from 'fastify-decorators'
import {IUserSearchPhoneUseCase, UserSearchPhoneUseCase} from 'src/use-cases/user/search-phone.usecase'
import {container} from 'tsyringe'

@Controller('/users')
export default class UserController {
  private readonly userSearchPhoneUseCase: IUserSearchPhoneUseCase

  constructor() {
    this.userSearchPhoneUseCase = container.resolve<IUserSearchPhoneUseCase>(UserSearchPhoneUseCase)
  }

  @GET()
  async searchHandler(req, res) {
    const result = await this.userSearchPhoneUseCase.exec(req.query)
    result.send(200, res)
  }
}
