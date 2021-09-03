import {IUseCase} from 'src/core/usecase'
import {Result} from 'src/core/result'
import {inject, singleton} from 'tsyringe'
import {CNPJResponse, CNPJService, ICNPJService} from 'src/services/external/cnpj.service'

export type ICompanyGetCNPJUseCase = IUseCase<string, CNPJResponse>

@singleton<ICompanyGetCNPJUseCase>()
export class CompanyGetCNPJUseCase implements ICompanyGetCNPJUseCase {
  constructor(@inject(CNPJService) private cnpjService: ICNPJService) {}

  async exec(data: string): Promise<Result<CNPJResponse>> {
    return await this.cnpjService.get(data)
  }
}
