import {IUseCase} from 'src/core/usecase'
import {Result} from 'src/core/result'
import {inject, singleton} from 'tsyringe'
import {IWatchlistService, WatchlistService} from 'src/services/watchlist/watchlist.service'

export type IWatchlistDeleteUseCase = IUseCase<string, void>

@singleton<IWatchlistDeleteUseCase>()
export class WatchlistDeleteUseCase implements IWatchlistDeleteUseCase {
  constructor(@inject(WatchlistService) private watchlistService: IWatchlistService) {}

  async exec(data: string): Promise<Result<void>> {
    return this.watchlistService.delete(data)
  }
}
