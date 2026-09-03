#!/bin/bash
set -e

echo "Starting test database..."
docker-compose -f docker-compose.test.yml up -d

# Wait for DB to be healthy
until [ "`docker inspect -f {{.State.Health.Status}} $(docker-compose -f docker-compose.test.yml ps -q test-db)`" == "healthy" ]; do
    sleep 1;
done;

export DATABASE_URL="postgresql://testuser:testpassword@localhost:5434/testdb"
export JWT_SECRET="test_secret_for_tests_must_be_32_bytes_long"
export NODE_ENV="test"
export RATE_LIMIT_LOGIN_MAX=3
export RATE_LIMIT_REGISTER_MAX=100

echo "Running migrations..."
npx prisma migrate deploy --schema=../database/prisma/schema.prisma

echo "Running tests..."
node --experimental-vm-modules node_modules/jest/bin/jest.js --runInBand --detectOpenHandles "$@"
EXIT_CODE=$?

echo "Tearing down test database..."
docker-compose -f docker-compose.test.yml down -v

exit $EXIT_CODE
