import log from 'barelog'
import Keycloak from 'keycloak-connect'
import { ApplicationConfig } from './config'
import { ApplicationSessions } from './sessions'

/**
 * Applies keycloak middleware to an express application if a KEYCLOAK_CONFIG
 * environment variable is set to a valid OIDC JSON from a "public" Keycloak
 * client type
 */
export default function getKeycloak (sessions: ApplicationSessions, config: ApplicationConfig) {
  const { KEYCLOAK_CONFIG } = config
  const { store }= sessions

  log('creating a keycloak instance using config: %j', KEYCLOAK_CONFIG)

  return new Keycloak({ store }, KEYCLOAK_CONFIG)
}
