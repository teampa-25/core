#!/bin/bash
set -e

echo "Checking and generating RSA keys if needed..."
npx ts-node -e "require('./src/common/utils/generateKeys').ensureKeysExist();"

echo "Waiting for database to be ready..."

# Function to check if database is ready
check_db() {
  npx sequelize-cli db:migrate:status >/dev/null 2>&1
  return $?
}

# Wait for database to be ready
until check_db; do
  echo "Database not ready, retrying in 5 seconds..."
  sleep 5
done

# Check if migrations need to be applied
echo "Checking migration status..."
PENDING_MIGRATIONS=$(npx sequelize-cli db:migrate:status | grep -c "down" || true)

if [ "$PENDING_MIGRATIONS" -gt 0 ]; then
  echo "Running database migrations..."
  npx sequelize-cli db:migrate

  echo "Running database seeds..."
  npx sequelize-cli db:seed:all
else
  echo "Migrations already applied, skipping..."
fi

echo "Starting application..."

exec "$@"
