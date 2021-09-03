import context from 'src/lib/async-context'

export class SessionService {
  static getSession(): any | undefined {
    const store = context.getStore()

    if (!store) {
      throw new Error('This service has no authentication')
    }

    return store.get('session')
  }
}
