# InferNode - Node backend for BAM

<div style="height:400px; overflow:hidden; margin:auto">
  <img src="./public/InferNode.png" style="width:100%; height:100%; object-fit:cover; object-position:center;" />
</div>

> _"I can see it... the code." - Neo, The Matrix (1999)_

# Introduction

## Features

- [x] : encrypted passwords

## Installation

### Building

When building, docker copies all but `src` and `tsconfig.json` into container, so it can generate an independent `node_modules`.
`src` and `tsconfig.json` are mounted as volumes into container so that every change to those is automatically synced to container.
Other changes, outside `src` and `tsconfig.json`, require a new build.

#### First launch or those that need a rebuild

```bash
docker compose up --build
# or
docker compose up --build -d
```

Also, remember to run migrations and seeders

```bash

docker exec -it infernode-app npx sequelize-cli db:migrate

docker exec -it infernode-app npx sequelize-cli db:seed:all

```

#### Every other launch

```bash
docker compose up
# or
docker compose up -d
```

### Generate Keys

```bash
npm run keys
```

# Usage

## Env Variables

First, you need to setup the `.env` with the following required values

```env

# Server configurations
PORT=3000
NODE_ENV=development
API_VERSION=v1

# JWT Configuration
JWT_EXPIRATION=24h
JWT_PRIVATE_KEY_PATH=./keys/private.key
JWT_PUBLIC_KEY_PATH=./keys/public.key
JWT_ALGORITHM=RS256

# Database configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=InferNode
DB_DIALECT=postgres

```

## Adding packages

After running containers, just lunch:

```bash

docker exec -it infernode-api npm install package-name

docker exec -it infernode-api npm uninstall package-name

```

# API

# PostgreSQL

# Design

## UML etc

# Contributors

# Acknowledgements
