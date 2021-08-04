import { container } from "tsyringe"
import { IWatchlistRepository, WatchlistRepository } from "./watchlist.repos"

container.registerSingleton<IWatchlistRepository>('WatchlistRepository', WatchlistRepository)
