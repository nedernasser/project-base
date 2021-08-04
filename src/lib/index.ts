import {container} from 'tsyringe'
import {ILoggerFactory, LoggerFactory} from './logger'

container.registerSingleton<ILoggerFactory>('LoggerFactory', LoggerFactory)
