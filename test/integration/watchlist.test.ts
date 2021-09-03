import 'mocha'
import 'reflect-metadata'
import axios from 'axios'
import {expect} from 'chai'
import {step} from 'mocha-steps'
import {authenticator} from 'otplib'

let client

const payload = {
  id: null,
  documentType: 'CPF',
  document: '',
  reason: 'BLOCKED',
  description: 'Test',
  isActive: true
}

describe('Watchlist', () => {
  before(async () => {
    client = axios.create({
      baseURL: `${process.env.API_URL as string}:${process.env.EXTERNAL_PORT}/`,
      responseType: 'json',
      headers: {
        Accept: 'application/json',
        'x-api-key': process.env.API_KEY
      }
    })

    const token = authenticator.generate(process.env.TOTP_SECRET as string)

    const userPayload = {
      user: "5511999999999",
      password: token,
      mode: 'MOBILE',
    }
    const response = await client.post('auth/signin', userPayload)

    client.headers = {
      Accept: 'application/json',
      Authorization: `Bearer ${response.data.accessToken}`
    }
    client = axios.create({
      baseURL: `${process.env.API_URL as string}:${process.env.EXTERNAL_PORT}/`,
      responseType: 'json',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${response.data.accessToken}`,
        'x-api-key': process.env.API_KEY
      }
    })
  })

  step('Must be list an empty watchlist', async () => {
    const response = await client.get('watchlists/list?all=true')

    expect(response.status).to.equal(200)
    expect(response.data.length).to.equal(0)
  })

  step('Must be add a watchlist', async () => {
    payload.document = '30207385807'
    const response = await client.post('watchlists', payload)
    expect(response.status).to.equal(201)
  })

  step('Must be update a watchlist reason', async function() {
    let response = await client.put(`watchlists/30207385807`, {
      reason: 'SCAM'
    })
    expect(response.status).to.equal(204)
  })

  step('Must be delete a watchlist', async () => {
    let response = await client.delete(`watchlists/30207385807`)
    expect(response.status).to.equal(204)
  })

  step('Must be list all watchlist', async () => {
    let response = await client.get('watchlists/list?all=true')
    expect(response.status).to.equal(200)
    expect(response.data.length).to.equal(1)
  })

  step('Must be update activate a watchlist', async function() {
    let checkResponse = await client.get(`watchlists/30207385807`)
    expect(checkResponse.status).to.equal(200)
    expect(checkResponse.data.isActive).to.equal(false)

    let response = await client.put(`watchlists/30207385807`, {
      isActive: true
    })
    expect(response.status).to.equal(204)

    checkResponse = await client.get(`watchlists/30207385807`)
    expect(checkResponse.status).to.equal(200)
    expect(checkResponse.data.isActive).to.equal(true)
  })

  step('Must be list all active watchlist', async () => {
    const response = await client.get('watchlists/list?all=false')

    if (response.data.length > 0) {
      expect(response.data[0]).to.have.all.keys(
        'id',
        'documentType',
        'document',
        'reason',
        'description',
        'isActive',
        'createdAt',
        'updatedAt'
      )
      expect(response.data.length).to.equal(1)
    } else {
      expect(response.status).to.equal(200)
    }
  })

  step('Must be fail to add watchlist with missing document', async () => {
    try {
      await client.post('watchlists', payload)
      expect.fail()
    } catch (error) {
      const {response} = error

      expect(response.status).equal(400)
    }
  })

  step('Must be fail to add a watchlist containing a value greater than the document type field capacity', async () => {
    try {
      payload.documentType = 'CPF'
      payload.document = '12345678901234567890'
      await client.post('watchlists', payload)
      expect.fail()
    } catch (error) {
      const {response} = error

      expect(response.status).equal(400)
    }
  })

  step('Must be fail to add a duplicate watchlist', async () => {
    try {
      await client.post('watchlists', payload)
      expect.fail()
    } catch (error) {
      const {response} = error

      expect(response.status).equal(400)
    }
  })

  step('Must be fail to update a invalid watchlist', async () => {
    const wrongPayload = JSON.parse(JSON.stringify(payload))
    wrongPayload.document = '1234567890'
    try {
      await client.put(`watchlists/${wrongPayload.document}`, wrongPayload)
      expect.fail()
    } catch (error) {
      const {response} = error

      expect(response.status).equal(400)
    }
  })
})
