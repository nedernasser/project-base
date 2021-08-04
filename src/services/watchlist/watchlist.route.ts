/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {container} from 'tsyringe'
import {IWatchlistService} from './watchlist.service'

const watchlistService = container.resolve<IWatchlistService>('WatchlistService')

export default async app => {
  app.get('/', async (req, res) => {
    res.send(await watchlistService.list())
  })

  app.post('/', async (req, res) => {
    const result = await watchlistService.create(req.body)
    result.send(201, res)
  })

  app.put('/', async (req, res) => {
    const result = await watchlistService.update(req.body)
    result.send(204, res)
  })

  app.delete('/:id', async (req, res) => {
    const result = await watchlistService.delete(req.params.id)
    result.send(204, res)
  })
}
