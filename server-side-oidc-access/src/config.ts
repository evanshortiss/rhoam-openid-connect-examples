import { randomBytes } from 'crypto'
import { from } from 'env-var'
import { KeycloakConfig } from 'keycloak-connect'

export type ApplicationConfig = {
  NODE_ENV: string
  HTTP_PORT: number
  SESSION_SECRET: string
  KEYCLOAK_JSON: KeycloakConfig,
  PRODUCT_API_URL: string
}

export default function getConfig (env: NodeJS.ProcessEnv): ApplicationConfig {
  const { get } = from(env)
  const DEFAULT_SESSION_SECRET = randomBytes(8).toString()

  return {
    NODE_ENV: get('NODE_ENV').required().asEnum(['development', 'production']),
    HTTP_PORT: get('HTTP_PORT').default(8080).asPortNumber(),
    SESSION_SECRET: get('SESSION_SECRET').default(DEFAULT_SESSION_SECRET).asString(),
    KEYCLOAK_JSON: get('KEYCLOAK_JSON').required().asJsonObject() as KeycloakConfig,
    PRODUCT_API_URL: get('PRODUCT_API_URL').required().example('https://products-apicast-production.example-acme-corp.com/products').asUrlString()
  }
}
