import {container} from 'tsyringe'
import {IRedisCli, RedisCli} from '@lib/redis'
import {RedisClient} from 'redis'
import db from '@lib/db'
import {Sequelize} from 'sequelize'
import {Controller, GET} from 'fastify-decorators'

@Controller('health-check')
export default class HealthCheckController {
  private readonly _redisCli: RedisClient
  private readonly _db: Sequelize

  constructor() {
    const redis = container.resolve<IRedisCli>(RedisCli)
    this._redisCli = redis.instance
    this._db = db.sequelize as Sequelize
  }

  @GET()
  async check(req, res): Promise<void> {
    try {
      await this.redisCheck()
      await this.sequelizeCheck()
      res.code(200).send()
    } catch (error) {
      res.code(503).send()
    }
  }

  private redisCheck(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._redisCli.ping((err, pong) => {
        if (err || pong !== 'PONG') {
          reject(' Redis instance is not responsive.')
        } else {
          resolve()
        }
      })
    })
  }

  private sequelizeCheck(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._db
        .authenticate()
        .then((error: any) => {
          if (error) {
            reject(error)
          } else {
            resolve()
          }
        })
        .catch(error => {
          reject(error)
        })
    })
  }
}
