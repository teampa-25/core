# InferNode - Node backend for BAM

<div style="height:400px; overflow:hidden; margin:auto">
  <img src="./public/InferNode.png" style="width:100%; height:100%; object-fit:cover; object-position:center;" />
</div>

> _"I can see it... the code." - Neo, The Matrix (1999)_

# Introduction

## Features

# Dependencies

- [helmet](https://www.npmjs.com/package/helmet): automatically set HTTP response headers
- [morgan](https://expressjs.com/en/resources/middleware/morgan.html): logger for express

## Installation

### Building

### Docker

# Usage

## Env Variables

Create a `.env` with your configuration, you can copy `.env.example` as a boilerplate.

```bash
cp .env.example .env
```

First, you need to setup the `.env` with the following required values.

```env

# Server configurations
API_PORT=3000
HOSTNAME=localhost
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

### API

### PostgreSQL

# Design

## UML etc

# Contributors

# Acknowledgements
