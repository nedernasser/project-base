import 'reflect-metadata'

import 'src/lib'
import 'src/repos'
import 'src/services'

import libApp from '@lib/app'
import {exec} from 'child_process'
import {DataBase} from '@lib/db'

const app = libApp()

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

app.then(server => {
  server.listen(parseInt(process.env.APP_PORT ?? '3000'), '0.0.0.0', async (error: Error, address: string) => {
    if (error) throw error
    server.log.info(`Server listening on ${address}`)

    await runMigrations()
    await runSeeds()

    new DataBase().connect()
  })
})
