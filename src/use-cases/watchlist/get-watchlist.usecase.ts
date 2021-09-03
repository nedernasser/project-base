import {IUseCase} from 'src/core/usecase'
import {Result} from 'src/core/result'
import {inject, singleton} from 'tsyringe'
import {IWatchlistRepository, WatchlistRepository} from 'src/repos/watchlist.repos'
import {ErrorCode} from 'src/const/error'
import {WatchlistDTO} from 'src/services/watchlist/watchlist.service'

export type IWatchlistGetUseCase = IUseCase<string, WatchlistDTO>

@singleton<IWatchlistGetUseCase>()
export class WatchlistGetUseCase implements IWatchlistGetUseCase {
  constructor(@inject(WatchlistRepository) private watchlistRepository: IWatchlistRepository) {}

  async exec(document: string): Promise<Result<WatchlistDTO>> {
    const result = await this.watchlistRepository.findOne({
      where: {document}
    })

    return result ? Result.ok(result) : Result.fail(ErrorCode.NOT_FOUND_WATCHLIST_ERROR)
  }
}
