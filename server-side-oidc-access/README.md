# 3scale and Keycloak Server-Side OIDC Example

## Local Development

1. Create a `.env` file in the repo based on the included `.env.template`.
1. Run `npm install`.
1. Run `npm run watch`. This starts a local development server with live-reload.

## Deploying on OpenShift

```bash
export SOURCE=https://github.com/evanshortiss/rhoam-openid-connect-examples
export PRODUCT_API_URL=https://products-apicast-production.replace-me.com/products

# Create a file named keycloak.json in your working directory. Paste the JSON
# content from the "Installation" tab under the client settings for your API
# client entry in SSO into the file. Run this command after doing that
oc create secret generic keycloak-config --from-file=keycloak.json

# Create a build, service, and deployment for the application
oc new-app $SOURCE \
-l "app.openshift.io/runtime=nodejs"
--docker-image="registry.access.redhat.com/ubi8/nodejs-14:latest" \
--context-dir=server-side-oidc-access \
-e PRODUCT_API_URL=$PRODUCT_API_URL \
-e NODE_ENV=production \
--name server-webapp

# Add the keycloak.json into the deployment environment
oc set env deployment/server-webapp --from=secret/keycloak-config

# Expose the service via HTTPS
oc expose svc server-webapp
oc patch route server-webapp --type=json -p='[{"op":"replace","path":"/spec/tls","value":{"termination":"edge","insecureEdgeTerminationPolicy":"Redirect"}}]'

# Print the URL used to access the application
oc get route server-webapp -o jsonpath='{.spec.host}'
```
