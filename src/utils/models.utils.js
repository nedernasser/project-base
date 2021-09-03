/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Transaction} from 'sequelize'
import {getNamespace} from 'cls-hooked'
import logger from '@lib/logger'
import db from '@lib/db'
import ApiError from 'src/const/error'

export async function scoped(func) {
  const namespace = getNamespace('transaction-namespace')

  if (namespace.get('transaction')) {
    return func()
  }

  return await db.sequelize.transaction(
    {
      isolationLevel: Transaction.ISOLATION_LEVELS.READ_COMMITTED
    },
    async transaction => {
      try {
        return await func({transaction})
      } catch (error) {
        throw new ApiError(400, 400, JSON.stringify(error))
      }
    }
  )
}
