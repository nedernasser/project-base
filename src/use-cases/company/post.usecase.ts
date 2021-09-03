import {IUseCase} from 'src/core/usecase'
import {Result} from 'src/core/result'
import {inject, singleton} from 'tsyringe'
import {ICompanyService, CompanyDTO, CompanyService} from 'src/services/company/company.service'

export type ICompanyPostUseCase = IUseCase<CompanyDTO, bigint>

@singleton<ICompanyPostUseCase>()
export class CompanyPostUseCase implements ICompanyPostUseCase {
  constructor(@inject(CompanyService) private companyService: ICompanyService) {}

  async exec(data: CompanyDTO): Promise<Result<bigint>> {
    return this.companyService.create(data)
  }
}
