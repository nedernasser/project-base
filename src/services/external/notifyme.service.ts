import axios from 'axios'
import {ILoggerFactory, ILoggerService, LoggerFactory} from '@lib/logger'
import {inject, singleton} from 'tsyringe'
import {Result} from 'src/core/result'

export interface NotifymeEmailResponse {
  messageId: string
  success: boolean
}

export interface INotifymeService {
  sendSMS(params: any): Promise<Result<any>>
  sendEmail(params: any): Promise<any>
}

@singleton<INotifymeService>()
export class NotifymeService implements INotifymeService {
  private readonly logger: ILoggerService
  private url: string
  private client: any

  constructor(@inject(LoggerFactory) loggerFactory: ILoggerFactory) {
    this.logger = loggerFactory.build('NotifymeService')
    this.url = process.env.NOTIFYME_URL as string

    this.client = axios.create({
      baseURL: process.env.NOTIFYME_URL,
      timeout: 120 * 1000,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${process.env.NOTIFYME_BEARER_TOKEN}`
      }
    })
  }

  async sendSMS(params: any): Promise<Result<any>> {
    try {
      await this.client.post('/sms', {
        app: 'hiring-next-api',
        service: 'aws',
        ...params
      })

      return Result.ok()
    } catch (error) {
      this.logger.error(`::notifyme::sendSMS - ${error.message}`)
      this.logger.error(`::notifyme::sendSMS - ${error.stack}`)
      return Result.fail(error)
    }
  }

  async sendEmail(params: any): Promise<any> {
    try {
      const {data} = await this.client.post('/email', {
        app: 'payments-api',
        ...params
      })

      return data
    } catch (error) {
      this.logger.error(`::notifyme::sendEmail - ${error.message}`)
      this.logger.error(`::notifyme::sendEmail - ${error.stack}`)
      throw error
    }
  }
}
