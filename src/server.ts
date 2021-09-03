import 'reflect-metadata'

import 'src/repos'

import {App, IAppFactory} from '@lib/app'
import {exec} from 'child_process'
import {DataBase} from '@lib/db'
import {container} from 'tsyringe'

function runMigrations(): Promise<void> {
  return new Promise(resolve => {
    const migrate = exec('npm run migration', {env: process.env})

    migrate.stdout?.pipe(process.stdout)
    migrate.stderr?.pipe(process.stderr)

    migrate.on('close', resolve)
  })
}

function runSeeds(): Promise<void> {
  return new Promise(resolve => {
    const seed = exec('npm run seed', {env: process.env})

    seed.stdout?.pipe(process.stdout)
    seed.stderr?.pipe(process.stderr)

    seed.on('close', resolve)
  })
}

async function startServer() {
  await runMigrations()
  // await runSeeds()
  new DataBase().connect(async () => {
    const appInstance = container.resolve<IAppFactory>(App)
    const port = process.env.APP_PORT ?? '3000'

    const serverInstance = await appInstance.build()
    await serverInstance.listen(port)
  })
}

startServer()
