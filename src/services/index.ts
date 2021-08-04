import {container} from 'tsyringe'
import { IWatchlistService, WatchlistService } from './watchlist/watchlist.service'

container.registerSingleton<IWatchlistService>('WatchlistService', WatchlistService)
