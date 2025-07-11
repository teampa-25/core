#!/usr/bin/env sh
set -e

host="${DB_HOST:-db}"
port="${DB_PORT:-5432}"
user="${DB_USER:-postgres}"

until pg_isready -h "$host" -p "$port" -U "$user"; do
  echo "waiting for postgres to be ready on $host:$port..."
  sleep 1
done

echo "postgres is ready"
exec "$@"
