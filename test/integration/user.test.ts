import axios from 'axios'
import {expect} from 'chai'
import 'mocha'
import {authenticator} from 'otplib'

describe('User', () => {
  let client
  
  before(async () => {
    const payload = {
      user: {
        name: 'Neder Nasser',
        document: '30207385807',
        phone: '5511111111111'
      },
      company: {
        document: '15664649000184'
      }
    }
  
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
      user: '5511986587877',
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
  
    await client.post('companies', payload)
  })
  
  it('Must be get a valid user', async () => {
    const response = await client.get('users?phone=5511111111111')
    expect(response.status).to.equal(200)
  })
  it('Must be fail to get a invalid user', async () => {
    try {
      await client.get('users?phone=5511987467272')

      expect.fail()
    } catch (error) {
      const {response} = error

      expect(response.status).equal(404)
    }
  })
})
