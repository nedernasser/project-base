import {container} from 'tsyringe'
import {Controller, DELETE, GET, POST, PUT} from 'fastify-decorators'
import {DecorateAll} from 'src/decorators/decorate-all.decorator'
import {Authorization} from 'src/decorators/authorization.decorator'
import {IWatchlistDeleteUseCase, WatchlistDeleteUseCase} from '../use-cases/watchlist/delete.usecase'
import {IWatchlistGetListUseCase, WatchlistGetListUseCase} from '../use-cases/watchlist/get-list.usecase'
import {IWatchlistPostUseCase, WatchlistPostUseCase} from '../use-cases/watchlist/post.usecase'
import {IWatchlistUpdateUseCase, WatchlistUpdateUseCase} from '../use-cases/watchlist/update.usecase'
import {WatchlistCreateBodySchema, WatchlistUpdateBodySchema} from '@services/watchlist/watchlist.schema'
import {IWatchlistGetUseCase, WatchlistGetUseCase} from 'src/use-cases/watchlist/get-watchlist.usecase'

@Controller('/watchlists')
@DecorateAll(Authorization)
export default class WatchListController {
  private readonly watchlistDeleteUseCase: IWatchlistDeleteUseCase
  private readonly watchlistGetListUseCase: IWatchlistGetListUseCase
  private readonly watchlistGetUseCase: IWatchlistGetUseCase
  private readonly watchlistPostUseCase: IWatchlistPostUseCase
  private readonly watchlistUpdateUseCase: IWatchlistUpdateUseCase

  constructor() {
    this.watchlistDeleteUseCase = container.resolve<IWatchlistDeleteUseCase>(WatchlistDeleteUseCase)
    this.watchlistGetListUseCase = container.resolve<IWatchlistGetListUseCase>(WatchlistGetListUseCase)
    this.watchlistGetUseCase = container.resolve<IWatchlistGetUseCase>(WatchlistGetUseCase)
    this.watchlistPostUseCase = container.resolve<IWatchlistPostUseCase>(WatchlistPostUseCase)
    this.watchlistUpdateUseCase = container.resolve<IWatchlistUpdateUseCase>(WatchlistUpdateUseCase)
  }

  @GET('/list')
  async listHandler(req, res) {
    const result = await this.watchlistGetListUseCase.exec(req.query.all)
    result.send(200, res)
  }

  @POST('', {schema: {body: WatchlistCreateBodySchema}})
  async createHandler(req, res) {
    const result = await this.watchlistPostUseCase.exec(req.body)
    result.send(201, res)
  }

  @GET('/:document')
  async getWatchlist(req, res) {
    const result = await this.watchlistGetUseCase.exec(req.params.document)
    result.send(200, res)
  }

  @PUT('/:document', {schema: {body: WatchlistUpdateBodySchema}})
  async updateHandler(req, res) {
    const result = await this.watchlistUpdateUseCase.exec({
      ...req.body,
      document: req.params.document
    })
    result.send(204, res)
  }

  @DELETE('/:document')
  async deleteHandler(req, res) {
    const result = await this.watchlistDeleteUseCase.exec(req.params.document)
    result.send(204, res)
  }
}
