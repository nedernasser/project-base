import {IUseCase} from 'src/core/usecase'
import {Result} from 'src/core/result'
import {inject, singleton} from 'tsyringe'
import {IWatchlistService, WatchlistDTO, WatchlistService} from 'src/services/watchlist/watchlist.service'

export type IWatchlistUpdateUseCase = IUseCase<WatchlistDTO, bigint>

@singleton<IWatchlistUpdateUseCase>()
export class WatchlistUpdateUseCase implements IWatchlistUpdateUseCase {
  constructor(@inject(WatchlistService) private watchlistService: IWatchlistService) {}

  async exec(data: WatchlistDTO): Promise<Result<bigint>> {
    return this.watchlistService.update(data)
  }
}
