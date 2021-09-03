import {IUseCase} from 'src/core/usecase'
import {Result} from 'src/core/result'
import {inject, singleton} from 'tsyringe'
import {IWatchlistService, WatchlistDTO, WatchlistService} from 'src/services/watchlist/watchlist.service'

export type IWatchlistGetListUseCase = IUseCase<string, WatchlistDTO[]>

@singleton<IWatchlistGetListUseCase>()
export class WatchlistGetListUseCase implements IWatchlistGetListUseCase {
  constructor(@inject(WatchlistService) private watchlistService: IWatchlistService) {}

  async exec(data: string): Promise<Result<WatchlistDTO[]>> {
    return this.watchlistService.list(data)
  }
}
