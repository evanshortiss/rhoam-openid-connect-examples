import log from 'barelog'
import getConfig from "./config"
import getKeycloak from "./keycloak"
import getApplicationServer from "./server"
import getSessionMiddlewareAndStore from "./sessions"

const config = getConfig(process.env)
const sessions = getSessionMiddlewareAndStore(config)
const keycloak = getKeycloak(sessions, config)
const app = getApplicationServer({ keycloak, sessions }, config)

app.listen(config.HTTP_PORT, () => {
  log(`🚀 started listening on port ${config.HTTP_PORT}`)
})
