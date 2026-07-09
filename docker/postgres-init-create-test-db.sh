#!/bin/bash
# Create test_db on same Postgres instance (runs only on first init of postgres volume)
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "postgres" -c "CREATE DATABASE test_db;"
