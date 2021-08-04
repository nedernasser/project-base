import Watchlist from 'src/models/watchlist.model'
import {BaseRepository, IBaseRepository} from './base.repos'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IWatchlistRepository extends IBaseRepository<Watchlist> {}

export class WatchlistRepository extends BaseRepository<Watchlist> implements IWatchlistRepository {
  constructor() {
    super(Watchlist)
  }
}
