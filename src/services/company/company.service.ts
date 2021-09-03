import {singleton, inject} from 'tsyringe'
import {ILoggerFactory, ILoggerService, LoggerFactory} from '@lib/logger'
import {ICompanyRepository} from 'src/repos/company.repos'
import {Result} from 'src/core/result'
import {ErrorCode} from 'src/const/error'

export interface CompanyDTO {
  id?: bigint
  legalResponsibleId?: bigint
  document: string
  commercialProposalAt?: Date
  commercialProposalApprovedBy?: string
  isActive: boolean
}

export interface ICompanyService {
  create(request: CompanyDTO): Promise<Result<bigint>>
}

@singleton<ICompanyService>()
export class CompanyService implements ICompanyService {
  private readonly logger: ILoggerService

  constructor(
    @inject(LoggerFactory) loggerFactory: ILoggerFactory,
    @inject('CompanyRepository') private companyRepository: ICompanyRepository
  ) {
    this.logger = loggerFactory.build('CompanyService')
  }

  async create(request: CompanyDTO): Promise<Result<bigint>> {
    let company = await this.companyRepository.findOne({
      where: {
        document: request.document,
        isActive: true
      }
    })

    if (company) {
      return Result.fail(ErrorCode.DUPLICATED_COMPANY_ERROR)
    }

    company = await this.companyRepository.create(request)
    return Result.ok(company.id)
  }
}
