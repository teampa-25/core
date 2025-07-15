#!/bin/bash
set -e

# echo "Waiting for database to be ready..."
#
# until npx sequelize-cli db:migrate; do
#   echo "Database not ready, retrying in 5 seconds..."
#   sleep 5
# done
#
# echo "Running database seeds..."
# npx sequelize-cli db:seed:all
#
# echo "Starting application..."
exec "$@"
