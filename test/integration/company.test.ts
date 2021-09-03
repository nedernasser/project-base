import axios from 'axios'
import {expect} from 'chai'
import 'mocha'
import { step } from 'mocha-steps'
import { authenticator } from 'otplib'

let client
const payload = {
  user: {
    name: 'Neder Nasser',
    document: '30207385807',
    phone: '5511777777777'
  },
  company: {
    document: '36567721000125'
  }
}

describe('Company', () => {
  
  before(async () => {
    client = axios.create({
      baseURL: `http://localhost:${process.env.EXTERNAL_PORT}/`,
      responseType: 'json',
      headers: {
        Accept: 'application/json',
        'x-api-key': process.env.API_KEY
      }
    })

    const token = authenticator.generate(process.env.TOTP_SECRET as string)

    const userPayload = {
      user: '5511999999999',
      password: token,
      mode: 'MOBILE',
    }
    const response = await client.post('auth/signin', userPayload)

    client = axios.create({
      baseURL: `http://localhost:${process.env.EXTERNAL_PORT}/`,
      responseType: 'json',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${response.data.accessToken}`,
        'x-api-key': process.env.API_KEY
      }
    })
  })

  it('Must be create a company', async () => {
    const response = await client.post('companies', payload)

    expect(response.status).to.equal(201)
  })

  it('Must be get a valid company', async () => {
    const response = await client.get('companies/36567721000125')

    expect(response.status).to.equal(200)
  })

  it('Must be fail to get a invalid company', async () => {
    try {
      await client.get('companies/12345678901234')

      expect.fail()
    } catch (error) {
      const {response} = error
      expect(response.status).equal(404)
    }
  })

  it('Must be fail to create with a invalid company', async () => {
    try {
      payload.company.document = '12345678901234'
      await client.post('companies', payload)

      expect.fail()
    } catch (error) {
      const {response} = error
      expect(response.status).equal(404)
    }
  })

  it('Must be fail to create without a user phone', async () => {
    try {
      payload.user.phone = ''
      await client.post('companies', payload)

      expect.fail()
    } catch (error) {
      const {response} = error

      expect(response.status).equal(400)
    }
  })

  it('Must be fail to create without a user', async () => {

    try {
      const wrongPayload = JSON.parse(JSON.stringify(payload))
      wrongPayload.user = undefined
      await client.post('companies', payload)

      expect.fail()
    } catch (error) {
      const {response} = error

      expect(response.status).equal(400)
    }
  })

  it('Must be fail to create without a company', async () => {
    try {
      const wrongPayload = JSON.parse(JSON.stringify(payload))
      wrongPayload.company = undefined
      await client.post('companies', payload)

      expect.fail()
    } catch (error) {
      const {response} = error

      expect(response.status).equal(400)
    }
  })
})
