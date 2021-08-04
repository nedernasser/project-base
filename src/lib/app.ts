import {v4 as uuidv4} from 'uuid'
import {ValidatorResult} from 'jsonschema'
import fastity, {FastifyInstance} from 'fastify'
import logger from './logger'
import context from './async-context'

import {IncomingMessage, Server, ServerResponse} from 'http'
import ApiError from 'src/const/error'

export type FastifyServer = FastifyInstance<Server, IncomingMessage, ServerResponse>

async function build(): Promise<FastifyServer> {
  const server = fastity({
    disableRequestLogging: true,
    requestIdHeader: 'x-request-id',
    genReqId: req => {
      return (req.headers['x-request-id'] ?? uuidv4()) as string
    },
    logger: {
      serializers: {
        req: function (req) {
          return {
            requestMethod: req.method,
            requestUrl: req.url,
            remoteIp: req.socket.address,
            userAgent: req.headers['user-agent']
          }
        }
      }
    }
  })

  await server.register(import('middie'))

  server.use((req: any, res, next) => {
    const requestId = req.id
    const store = new Map()
    store.set('requestId', requestId)

    return context.run(store, next)
  })

  server.addHook('onSend', async (req, reply) => {
    reply.header('x-request-id', req.id)
  })

  server.addHook('onResponse', (req, res, next) => {
    const httpRequest = {
      requestMethod: req.method,
      requestUrl: req.url,
      remoteIp: req.socket.address,
      userAgent: req.headers['user-agent'],
      status: res.statusCode,
      latency: (res.getResponseTime() / 1000).toFixed(9) + 's',
      responseSize: res.getHeader('Content-Length')
    }

    server.log.info({
      labels: {
        requestId: req.id
      },
      'logging.googleapis.com/sourceLocation': (req as any)?.context.config.url ?? req.url,
      'logging.googleapis.com/spanId': req.id,
      httpRequest
    })
    next()
  })

  server.register(import('fastify-cors'))

  server.use((server: any, options, next) => {
    const apiKey = server.headers['x-api-key']

    if (server.url !== '/') {
      if (!apiKey || apiKey !== process.env.API_KEY) {
        next(new ApiError(401, 400, 'API Key Invalid'))
      }
    }

    next()
  })

  server.setErrorHandler((error, request, reply) => {
    if (error instanceof ApiError) {
      reply.status(error.status).send({
        code: error.code,
        message: error.message,
        status: error.status,
        instance: request.url
      })
    } else if (error instanceof ValidatorResult) {
      const errors = error.errors.map(error => {
        return `${error.property} - ${error.message}`
      })

      reply.status(400).send({
        error: {
          errors
        },
        code: 400,
        message: 'Error on validate fields'
      })
    } else if (error.validation) {
      reply.status(400).send({
        code: 400,
        message: 'Invalid parameters',
        errors: error.validation
      })
    } else {
      logger.error(`::app:: - ${JSON.stringify(error, Object.getOwnPropertyNames(error))}`)
      reply.status(500).send({
        code: 500,
        title: error.message
      })
    }
  })

  return server
}

export default async () => {
  const app = await build()

  const route = await import('./routes')
  route.default(app)

  app.get('/', (req, res) => {
    res.type('text/html').send(`
<pre>
 _   _ _      _               _   _           _
| | | (_)    (_)             | \\ | |         | |
| |_| |_ _ __ _ _ __   __ _  |  \\| | _____  _| |_
|  _  | | '__| | '_ \\ / _\` | | . \` |/ _ \\ \\/ / __|
| | | | | |  | | | | | (_| | | |\\  |  __/>  <| |_
\\_| |_/_|_|  |_|_| |_|\\__, | \\_| \\_/\\___/_/\\_\\\\__|
                       __/ |
                      |___/
</pre>
    `)
  })

  return app
}
