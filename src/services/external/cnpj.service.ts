import axios from 'axios'
import {ILoggerFactory, ILoggerService, LoggerFactory} from '@lib/logger'
import {inject, singleton} from 'tsyringe'
import {Result} from 'src/core/result'
import {KeyValuePair} from 'src/core/keyvaluepair'
import {ErrorCode} from 'src/const/error'

export interface CNPJResponse {
  name: string
  document: string
  type: string
  size: string
  founded: string
  capital: bigint
  email: string
  phone: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  zipCode: string
  status: string
  legalNature: KeyValuePair
  primaryActivity: KeyValuePair
  secondaryActivities: KeyValuePair[]
  eligible?: {
    isEligible: boolean
    ineligibilityCode: string
  }
}

export interface ICNPJService {
  get(document: string): Promise<Result<CNPJResponse>>
}

@singleton<ICNPJService>()
export class CNPJService implements ICNPJService {
  private readonly logger: ILoggerService
  private url: string
  private client: any

  constructor(@inject(LoggerFactory) loggerFactory: ILoggerFactory) {
    this.logger = loggerFactory.build('CNPJService')
    this.url = process.env.CNPJ_URL as string

    this.client = axios.create({
      baseURL: process.env.CNPJ_URL,
      timeout: 120 * 1000,
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${process.env.CNPJ_BEARER_TOKEN}`
      }
    })
  }

  async get(document: string): Promise<Result<CNPJResponse>> {
    try {
      const {data} = (await this.client.get(`/reports/${document}`)).data
      const result = {
        name: data.name,
        document: data.cnpj,
        type: data.type,
        size: data.size,
        founded: data.founded,
        capital: data.capital,
        email: data.email,
        phone: data.phone,
        street: data.address.street,
        number: data.address.number,
        complement: data.address.complement,
        neighborhood: data.address.neighborhood,
        city: data.address.city,
        state: data.address.state,
        zipCode: data.address.zipcode,
        status: data.status,
        legalNature: {
          code: data.legal_nature.code,
          description: data.legal_nature.description
        },
        primaryActivity: {
          code: data.primary_activity.code,
          description: data.primary_activity.description
        },
        secondaryActivities: []
      } as CNPJResponse

      if (data.secondary_activities.length > 0) {
        result.secondaryActivities = data.secondary_activities.map(a => {
          return {
            code: a.code,
            description: a.description
          }
        })
      }

      return Result.ok(result)
    } catch (error) {
      this.logger.error(`::cnpj::get - ${error.message}`)
      this.logger.error(`::cnpj::get - ${error.stack}`)
      return Result.fail(ErrorCode.NOT_FOUND_COMPANY_ERROR)
    }
  }
}
