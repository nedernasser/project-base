import {IUseCase} from 'src/core/usecase'
import {Result} from 'src/core/result'
import {inject, singleton} from 'tsyringe'
import {IBusinessService, BusinessDTO, BusinessService} from 'src/services/business/business.service'

export type IBusinessPostUseCase = IUseCase<BusinessDTO, bigint>

@singleton<IBusinessPostUseCase>()
export class BusinessPostUseCase implements IBusinessPostUseCase {
  constructor(@inject(BusinessService) private businessService: IBusinessService) {}

  async exec(data: BusinessDTO): Promise<Result<bigint>> {
    return this.businessService.create(data)
  }
}
