import {Sequelize, SequelizeOptions} from 'sequelize-typescript'
import {Sequelize as SequelizeJS} from 'sequelize'
import {createNamespace} from 'cls-hooked'
import logger from './logger'
import models from 'src/models'

const obj: {sequelize: Sequelize | null; Sequelize: SequelizeJS | null} = {
  sequelize: null,
  Sequelize: null
}

export class DataBase {
  sequelize: Sequelize
  Sequelize: SequelizeJS

  connect(): Sequelize {
    const sequelize = new Sequelize({
      logging: true,
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      host: process.env.DB_HOST,
      dialect: process.env.DB_DIALECT,
      models: [__dirname + '/../models/*.model.*'],
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    } as SequelizeOptions)

    SequelizeJS.useCLS(createNamespace('transaction-namespace'))

    sequelize
      .authenticate()
      .then((error: any) => {
        if (error) {
          logger.error(`Unable to connect to the database: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`)
          process.exit(1)
        } else {
          logger.info('Connection established successfully.')
        }
      })
      .catch(error => {
        logger.error(`Unable to connect to the database: ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`)
        process.exit(1)
      })

    this.sequelize = sequelize
    this.Sequelize = SequelizeJS as any

    obj.sequelize = sequelize
    obj.Sequelize = this.Sequelize

    sequelize.addModels(Object.values(models))

    return sequelize
  }
}

export default obj
