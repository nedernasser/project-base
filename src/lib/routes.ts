/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {sync} from 'glob'
import {basename} from 'path'
import {plural} from 'pluralize'
import {join} from 'path'
import {FastifyServer} from './app'

const EXCLUDE = ['vindi']

export default function async(app: FastifyServer) {
  const routes = sync(join(__dirname, '/../services', '**', '*route.@(ts|js)'), {})

  for (const file of routes) {
    const routeName = basename(file).split('.')[0]

    app.register(
      async (role: FastifyServer) => {
        const route = await import(file)

        if (route.default) {
          await route.default(role)
        } else {
          await route(role)
        }
      },
      {prefix: EXCLUDE.includes(routeName) ? routeName : plural(routeName)}
    )
  }
}
