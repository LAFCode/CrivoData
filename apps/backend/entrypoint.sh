#!/bin/bash
set -e

echo "Running database migrations..."

# Run all migrations up to the latest head
alembic upgrade head

echo "Starting application..."
exec "$@"
