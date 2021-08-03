## 3scale and Keycloak Server-Side OIDC Examples

This repository contains two applications. Each is designed to use an API
exposed by 3scale API Management. Requests to the API are authenticated using
OpenID Connect integration between 3scale and Keycloak.

## Requirements

* Node.js v14.x
* npm 6.x
* Red Hat 3scale API Management (2.10 tested)
* Red Hat Single Sign-On (7.4 tested)
* Deployed the [Products API](https://github.com/btison/products-api) and protected it using 3scale and SSO OIDC integration.


## Application #1: Client-Side WebApp

This is a single-page web application written using React and TypeScript. It
uses the Keycloak JavaScript adapter to connect to a public Keycloak Client
and authenticate the user. A JWT format Bearer token is returned to the web
application after successful user authentication.

3scale uses the same Keycloak Client to authenticate requests to the API that
the web application uses. This means the client can include an OAuth 2.0 Bearer
token in their XHR API requests to make authenticated requests to the 3scale
API endpoint(s).

## Application #2: Server-Side Web Application

This is a traditional website-style application that renders HTML on the server
and returns it to the browser. It uses the [Keycloak Node.js](https://github.com/keycloak/keycloak-nodejs-connect)
adapater to integrate with Keycloak and authenticate users. A JWT format Bearer
token is returned to the web server via a callback URL after successful
end-user authentication.

3scale uses the same Keycloak Client to authenticate requests to the API that
the web server uses to authenticate users. This means the web server can
include the OAuth 2.0 Bearer token associated with the user's session to make
authenticated requests to the 3scale API endpoint(s) on behalf of the user.
