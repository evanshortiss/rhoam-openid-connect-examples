'use strict'

import express, { Express, ErrorRequestHandler } from 'express'
import log from 'barelog'
import boom from '@hapi/boom'
import path, { join } from 'path'
import { Keycloak } from 'keycloak-connect'
import { ApplicationSessions } from './sessions'
import { ApplicationConfig } from './config'
import fetchProducts, { ProductsRequestError } from './products'

export type ApplicationParams = {
  sessions: ApplicationSessions
  keycloak: Keycloak
}

export default function getApplicationServer (params: ApplicationParams, config: ApplicationConfig): Express {
  const { keycloak, sessions } = params
  const { PRODUCT_API_URL } = config
  const app = express()

  // Variables that will be available to all views
  app.locals.site = {
    title: 'OpenShift API Management - Server Side OIDC',
    description: 'Demonstrates API Security using OIDC integration between Red Hat SSO and 3scale API Management.'
  }

  // Configure server-side rendering
  app.engine('handlebars', require('express-handlebars')())
  app.set('views', path.resolve(__dirname, '../views'))
  app.set('view engine', 'handlebars')

  // Required when running behind a load balancer, e.g HAProxy
  app.set('trust proxy', true)

  // Apply some default web security headers
  app.use(require('helmet')())

  // Add liveness/readiness probes for Kubernetes
  require('kube-probe')(app)

  // Manages client sessions
  app.use(sessions.middleware)

  // Expose static assets under /public route
  app.use('/public/', express.static(join(__dirname, '../public')));

  // Mount the keycloak middleware. Also expose a /logout endpoint
  app.use(keycloak.middleware({
    logout: '/logout'
  }))

  app.get('/', (req, res) => {
    res.render('home.handlebars', {
      loggedIn: req.kauth.grant && !req.kauth.grant.isExpired()
    })
  })

  app.get('/login', keycloak.protect(), (req, res) => res.redirect('/products'))

  // Apply keycloak protection to all routes defined after this is called
  app.use(keycloak.protect())

  // Render a default landing page based on the user's role
  app.get('/products', async (req, res, next) => {
    // The kauth property is injected by the keycloak middleware
    const { access_token } = req.kauth.grant

    if (access_token) {
      const { given_name, family_name } = access_token.content
      const { token } = access_token
      try {
        const products = await fetchProducts(PRODUCT_API_URL, token)

        res.render('products.handlebars', {
          given_name,
          family_name,
          products: products.map((p) => {
            return { ...p, price: p.price.toFixed(2) }
          }),
          loggedIn: true
        })
      } catch (e) {
        if (e instanceof ProductsRequestError) {
          next(boom.forbidden('You\'re not permitted to access this data.'))
        } else {
          next(boom.internal('failed to fetch products from upstream 3scale API', e))
        }
      }
    } else {
      next(boom.internal('keycloak access token was missing from the request'))
    }
  })

  // Return a 404 message for all unknown routes
  app.use((req, res, next) => next(boom.notFound()))

  // Log errors/exceptions to stderr and return a server error
  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    log(`error processing a request ${req.method} ${req.originalUrl}: %j`, err)
    log(err?.stack)

    if (boom.isBoom(err)) {
      res.status(err.output.statusCode).render('error.handlebars', {
        message: err.output.payload.message
      })
    } else {
      res.status(500).end('internal server error')
    }
  }

  app.use(errorHandler)

  return app
}
