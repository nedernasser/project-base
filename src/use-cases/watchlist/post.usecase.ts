import {IUseCase} from 'src/core/usecase'
import {Result} from 'src/core/result'
import {inject, singleton} from 'tsyringe'
import {IWatchlistService, WatchlistDTO, WatchlistService} from 'src/services/watchlist/watchlist.service'

export type IWatchlistPostUseCase = IUseCase<WatchlistDTO, bigint>

@singleton<IWatchlistPostUseCase>()
export class WatchlistPostUseCase implements IWatchlistPostUseCase {
  constructor(@inject(WatchlistService) private watchlistService: IWatchlistService) {}

  async exec(data: WatchlistDTO): Promise<Result<bigint>> {
    return this.watchlistService.create(data)
  }
}
