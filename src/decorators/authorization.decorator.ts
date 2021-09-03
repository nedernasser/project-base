import {container} from 'tsyringe'
import {IJWTService, JWTService} from '@services/token/jwt.service'
import context from '@lib/async-context'

export function Authorization(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value
  const jwtService = container.resolve<IJWTService>(JWTService)

  descriptor.value = async function (...args: any[]) {
    const [req, res] = args

    const headerToken = req.headers.authorization

    if (!headerToken) {
      return res.code(401).send()
    }

    const token = headerToken.split(' ')

    if (token.length != 2 || token[0].toLowerCase() !== 'bearer') {
      return res.code(401).send()
    }

    let result = jwtService.validate(token[1])

    if (result.isFailure) {
      return res.code(401).send()
    }

    const map = new Map()
    map.set('session', result.getValue()?.data)

    context.run(map, () => {
      result = originalMethod.apply(this, args)
    })
  }
}
