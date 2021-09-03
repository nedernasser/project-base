import 'mocha'
import 'reflect-metadata'
import axios from 'axios'
import {expect} from 'chai'
import {step} from 'mocha-steps'
import {authenticator} from 'otplib'

let client = axios.create({
  baseURL: `${process.env.API_URL as string}:${process.env.EXTERNAL_PORT}/`,
  responseType: 'json',
  headers: {
    Accept: 'application/json',
    'x-api-key': process.env.API_KEY
  }
})

describe('Sign in', () => {
  step('Must be generate a token with success', async () => {
    const response = await client.post('auth/sms/send-token', {
      phone: '+5511956009755'
    })

    expect(response.status).to.equal(204)
  })

  step('Must be sign in an user', async () => {
    const userPayload = {
      user: "5511988888888",
      password: authenticator.generate(process.env.TOTP_SECRET as string),
      mode: 'MOBILE',
    }

    const response = await client.post('auth/signin', userPayload)

    client = axios.create({
      baseURL: `${process.env.API_URL as string}:${process.env.EXTERNAL_PORT}/`,
      responseType: 'json',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${response.data.accessToken}`,
        'x-api-key': process.env.API_KEY
      }
    })

    expect(response.status).to.equal(200)
  })
})
