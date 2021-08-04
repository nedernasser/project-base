import {createLogger, format, transports} from 'winston'
import {singleton} from 'tsyringe'
import pino, {Logger} from 'pino'
import devFormat from 'winston-dev-format'
import context from './async-context'

const {combine, timestamp, json, metadata, colorize, label, printf} = format
const {Console} = transports

const isLocal = process.env.NODE_ENV === 'local'

function level2Severity(): any {
  return format(info => {
    let level = info.level.toUpperCase()

    if (level === 'VERBOSE') {
      level = 'DEBUG'
    }

    info.severity = level

    console.log(info)

    return info
  })()
}

const defaultFormat = combine(metadata(), timestamp(), level2Severity(), json())

const localFormat = combine(colorize(), level2Severity(), devFormat())

export default createLogger({
  transports: [new Console()],
  exceptionHandlers: [new Console()],
  format: isLocal ? localFormat : defaultFormat
})

export interface ILoggerService {
  info(msg: string, ...args: any[]): void
  error(msg: string, ...args: any[]): void
  warn(msg: string, ...args: any[]): void
}

export class LoggerService implements ILoggerService {
  private logger: Logger

  constructor(private label: string) {
    this.logger = pino()
  }

  info(msg: string, ...args: any[]): void {
    const requestId = (context.getStore() as any)?.get('requestId')

    this.logger.info({
      message: msg,
      severity: 'INFO',
      labels: {
        requestId
      },
      'logging.googleapis.com/sourceLocation': {
        file: this.label
      },
      'logging.googleapis.com/spanId': requestId
    })
  }

  error(msg: string, ...args: any[]): void {
    const requestId = (context.getStore() as any)?.get('requestId')

    this.logger.error({
      message: msg,
      severity: 'INFO',
      labels: {
        requestId
      },
      'logging.googleapis.com/sourceLocation': {
        file: this.label
      },
      'logging.googleapis.com/spanId': requestId
    })
  }

  warn(msg: string, ...args: any[]): void {
    const requestId = (context.getStore() as any)?.get('requestId')

    this.logger.warn({
      message: msg,
      severity: 'INFO',
      labels: {
        requestId
      },
      'logging.googleapis.com/sourceLocation': {
        file: this.label
      },
      'logging.googleapis.com/spanId': requestId
    })
  }
}

export interface ILoggerFactory {
  build(context: string): ILoggerService
}

@singleton()
export class LoggerFactory implements ILoggerFactory {
  build(label: string): ILoggerService {
    return new LoggerService(label)
  }
}
