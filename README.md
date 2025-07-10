# InferNode - Node backend for BAM

<div style="height:400px; overflow:hidden; margin:auto">
  <img src="./public/InferNode.png" style="width:100%; height:100%; object-fit:cover; object-position:center;" />
</div>

> _"I can see it... the code." - Neo, The Matrix (1999)_

# Introduction

## Features

## Installation

### Building

### Docker

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

### API

### PostgreSQL

# Design

## UML etc

# Contributors

# Acknowledgements
