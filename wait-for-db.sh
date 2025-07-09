#!/usr/bin/env sh
set -e

host="${DB_HOST:-db}"
port="${DB_PORT:-5432}"
user="${DB_USER:-postgres}"

until pg_isready -h "$host" -p "$port" -U "$user"; do
  echo "⏳ Attendo Postgres su $host:$port..."
  sleep 1
done

echo "✅ Postgres è pronto!"
exec "$@"
