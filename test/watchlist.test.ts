import axios from 'axios'
import {expect} from 'chai'
import 'mocha'

const client = axios.create({
  baseURL: `http://localhost:${process.env.PORT}/`,
  responseType: 'json',
  headers: {
    Accept: 'application/json',
    'x-api-key': '5c7a38ee-985b-4d84-b3a4-025dddafa070'
  }
})

const payload = {
  id: null,
  documentType: 'CPF',
  document: '30207385807',
  reason: 'Test',
  description: 'Test',
  isActive: true
}

describe('Watchlist', () => {
  it('Add new watchlist', async () => {
    const response = await client.post('watchlist', payload)

    expect(response.status).to.equal(201)
  })

  it('Update watchlist', async () => {
    let response = await client.get('watchlist')
    const watchlist = response.data[0]
    watchlist.reason = 'Teste Update'
    response = await client.put('watchlist', watchlist)
    expect(response.status).to.equal(204)
  })

  it('Delete watchlist', async () => {
    let response = await client.get('watchlist')
    response = await client.delete('watchlist', response.data[0].id)
    expect(response.status).to.equal(204)
  })

  it('Validate watchlist list', async () => {
    const {data} = await client.get('watchlist')

    expect(data[0]).to.have.all.keys('id', 'documentType', 'document', 'reason', 'description')
    expect(data[0]).to.have.not.key('isActive')
  })
})
