import { RequestHandler } from 'express'
import session from 'express-session'
import { ApplicationConfig } from './config'

export type ApplicationSessions = {
  middleware: RequestHandler,
  store: session.MemoryStore
}

export default function getSessionMiddlewareAndStore (config: ApplicationConfig): ApplicationSessions {
  const { NODE_ENV, SESSION_SECRET } = config

  const store = new session.MemoryStore()
  const middleware = session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // Use secure cookies in production
      secure: NODE_ENV === 'production'
    },
    store
  })

  return { middleware, store }
}
