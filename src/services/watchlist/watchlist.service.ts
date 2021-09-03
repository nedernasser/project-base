import {Result} from 'src/core/result'
import {inject, singleton} from 'tsyringe'
import {IWatchlistRepository, WatchlistRepository} from 'src/repos/watchlist.repos'
import {ErrorCode} from 'src/const/error'
import {ILoggerFactory, ILoggerService, LoggerFactory} from '@lib/logger'
import {DocumentTypeEnum, WatchlistReasonTypeEnum} from 'src/models/watchlist.model'
import {SessionService} from '../session/session.service'

export interface WatchlistDTO {
  id?: bigint
  documentType: DocumentTypeEnum
  document: string
  reason: WatchlistReasonTypeEnum
  description?: string
  isActive: boolean
}

export interface IWatchlistService {
  create(request: WatchlistDTO): Promise<Result<bigint>>
  update(request: WatchlistDTO): Promise<Result<bigint>>
  delete(document: string): Promise<Result<void>>
  list(all: string): Promise<Result<WatchlistDTO[]>>
}

@singleton<IWatchlistService>()
export class WatchlistService implements IWatchlistService {
  private readonly logger: ILoggerService

  constructor(
    @inject(LoggerFactory) loggerFactory: ILoggerFactory,
    @inject(WatchlistRepository) private watchlistRepository: IWatchlistRepository
  ) {
    this.logger = loggerFactory.build('WatchlistService')
  }

  async create(request: WatchlistDTO): Promise<Result<bigint>> {
    const session = SessionService.getSession()

    let watchlist = await this.watchlistRepository.findOne({
      where: {
        document: request.document
      }
    })

    if (watchlist) {
      return Result.fail(ErrorCode.DUPLICATED_WATCHLIST_ERROR)
    }

    watchlist = await this.watchlistRepository.create(request)
    return Result.ok(watchlist.id)
  }

  async update(request: WatchlistDTO): Promise<Result<bigint>> {
    const result = await this.watchlistRepository.update(request, {
      where: {document: request.document}
    })

    return result.length === 0 ? Result.fail(ErrorCode.NOT_FOUND_WATCHLIST_ERROR) : Result.ok(request.id)
  }

  async delete(document: string): Promise<Result<void>> {
    const watchlist = await this.getWatchlist(document)

    if (!watchlist) {
      return Result.fail(ErrorCode.NOT_FOUND_WATCHLIST_ERROR)
    }

    await this.watchlistRepository.update(
      {
        isActive: false
      } as any,
      {
        where: {document}
      }
    )
    return Result.ok()
  }

  async list(all: string): Promise<Result<WatchlistDTO[]>> {
    let params = {}

    const isTrueSet = all?.toUpperCase() === 'FALSE'

    if (isTrueSet) {
      params = {where: {isActive: true}}
    }

    const result = await this.watchlistRepository.findAll(params)
    return Result.ok(result)
  }

  async getWatchlist(document: string): Promise<WatchlistDTO> {
    return await this.watchlistRepository.findOne({
      where: {document}
    })
  }
}
