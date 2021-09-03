import {IUseCase} from 'src/core/usecase'
import {Result} from 'src/core/result'
import {singleton} from 'tsyringe'
import {CNPJResponse} from 'src/services/external/cnpj.service'
import {getEligibility} from 'src/utils/company.utils'

export type ICompanyValidateUseCase = IUseCase<CNPJResponse, CNPJResponse>

@singleton<ICompanyValidateUseCase>()
export class CompanyValidateUseCase implements ICompanyValidateUseCase {
  constructor() {}

  async exec(data: CNPJResponse): Promise<Result<CNPJResponse>> {
    return await getEligibility(data)
  }
}
