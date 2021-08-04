import {Result} from '../../core/result'
import {singleton, inject} from 'tsyringe'
import WatchList from '@models/watchlist.model'
import {validator, watchlistSchema} from './watchlist.schema'
import {IWatchlistRepository} from '../../repos/watchlist.repos'

export interface WatchlistDTO {
  id?: bigint
  documentType: string
  document: string
  reason: string
  description?: string
  isActive: boolean
}

export interface IWatchlistService {
  create(request: WatchlistDTO): Promise<Result<bigint>>
  update(request: WatchlistDTO): Promise<Result<bigint>>
  delete(id: bigint): Promise<Result<void>>
  list(): Promise<Result<WatchList[]>>
}

@singleton()
export class WatchlistService implements IWatchlistService {
  constructor(@inject('WatchlistRepository') private watchlistRepository: IWatchlistRepository) {}

  async create(request: WatchlistDTO): Promise<Result<bigint>> {
    validator.validate(request, watchlistSchema, {throwAll: true})
    let watchlist = await this.watchlistRepository.findOne({document: request.document})
    
    if (!watchlist) {
      watchlist = await this.watchlistRepository.create(request)
    }

    return Result.ok(watchlist.id)
  }

  async update(request: WatchlistDTO): Promise<Result<bigint>> {
    validator.validate(request, watchlistSchema, {throwAll: true})
    const watchlist = await updateWatchList(request.isActive, request.id)
    return Result.ok(watchlist.id)
  }

  async delete(id: bigint): Promise<Result<void>> {
    await updateWatchList(false, id)
    return Result.ok()
  }

  async list(): Promise<Result<WatchList[]>> {
    return Result.ok(await this.watchlistRepository.findAll({isActive: true}))
  }
}

async function updateWatchList(isActive: boolean, id?: bigint) {
  const watchlist = await this.watchlistRepository.update(
    {
      isActive
    } as any,
    {
      where: {id}
    }
  )
  return watchlist
}
