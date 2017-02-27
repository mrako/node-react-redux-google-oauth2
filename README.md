# Google Oauth2 Example using React and Koa

## Prerequisites

[Generate an Google OAuth token](https://developers.google.com/identity/protocols/OAuth2)

[Docker and Docker Compose](https://docs.docker.com/compose/) or [Node](https://nodejs.org/)

## Running

    docker-compose build && docker-compose up

## Running locally

### Prepare database

    psql -c "CREATE ROLE example WITH CREATEDB LOGIN PASSWORD 'example'"
    psql -c "CREATE DATABASE example WITH OWNER example"

### Run app

    cd backend && npm install && npm start
    cd frontend && npm install && npm start

## Thanks

* [Passport Google Id Token](https://github.com/jmreyes/passport-google-id-token)
* [React Google Login](https://github.com/anthonyjgrove/react-google-login)
