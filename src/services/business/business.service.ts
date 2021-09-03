import {singleton, inject} from 'tsyringe'
import {ILoggerFactory, ILoggerService, LoggerFactory} from '@lib/logger'
import {IBusinessRepository} from 'src/repos/business.repos'
import {Result} from 'src/core/result'
import {ErrorCode} from 'src/const/error'

export interface BusinessDTO {
  id?: bigint
  companyId: bigint
  userId: bigint
  step?: string
  sellerId?: string
}

export interface IBusinessService {
  create(request: BusinessDTO): Promise<Result<bigint>>
}

@singleton<IBusinessService>()
export class BusinessService implements IBusinessService {
  private readonly logger: ILoggerService

  constructor(
    @inject(LoggerFactory) loggerFactory: ILoggerFactory,
    @inject('BusinessRepository') private businessRepository: IBusinessRepository
  ) {
    this.logger = loggerFactory.build('BusinessService')
  }

  async create(request: BusinessDTO): Promise<Result<bigint>> {
    let business = await this.businessRepository.findOne({
      where: {
        userId: request.userId,
        companyId: request.companyId
      }
    })

    if (business) {
      return Result.fail(ErrorCode.DUPLICATED_BUSINESS_ERROR)
    }

    business = await this.businessRepository.create(request)
    return Result.ok(business.id)
  }
}
