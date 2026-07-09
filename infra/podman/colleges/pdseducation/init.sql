-- =============================================================================
-- PDS Education - Database Initialization (TEMPLATE)
-- Passwords are injected from .env.secret via envsubst during bootstrap.
--
-- SECURITY: App user gets MINIMAL privileges only.
--   - NO superuser, NO createdb, NO createrole
--   - CREATE on schema (for Laravel migrations)
--   - DML only (SELECT, INSERT, UPDATE, DELETE) on tables
--   - USAGE + SELECT on sequences
--   - NO GRANT OPTION (cannot grant to others)
-- =============================================================================

-- Create limited application user
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'pdseducation_user') THEN
    CREATE ROLE pdseducation_user WITH
      LOGIN
      PASSWORD '${DB_PASSWORD}'
      NOSUPERUSER
      NOCREATEDB
      NOCREATEROLE
      NOINHERIT
      NOREPLICATION
      CONNECTION LIMIT 100;
  END IF;
END
$$;

-- Always sync password to current .env.secret value (handles re-runs)
ALTER ROLE pdseducation_user WITH PASSWORD '${DB_PASSWORD}';

-- Create limited backup user (read-only for pg_dump; no superuser)
DO $$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'pdseducation_backup') THEN
    CREATE ROLE pdseducation_backup WITH
      LOGIN
      PASSWORD '${BACKUP_PASSWORD}'
      NOSUPERUSER
      NOCREATEDB
      NOCREATEROLE
      NOINHERIT
      NOREPLICATION
      CONNECTION LIMIT 5;
  END IF;
END
$$;

-- Always sync password to current .env.secret value (handles re-runs)
ALTER ROLE pdseducation_backup WITH PASSWORD '${BACKUP_PASSWORD}';

-- Connect to the app database
\c "pdseducation_db";

-- Install required extensions (as superuser)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Grant CONNECT on database (only permission on DB level)
GRANT CONNECT ON DATABASE "pdseducation_db" TO pdseducation_user;
GRANT CONNECT ON DATABASE "pdseducation_db" TO pdseducation_backup;

-- Grant USAGE + CREATE on public schema (CREATE needed for Laravel migrations)
GRANT USAGE, CREATE ON SCHEMA public TO pdseducation_user;

-- Grant DML on all current tables
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO pdseducation_user;

-- Grant sequence usage (for auto-increment IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO pdseducation_user;

-- Set defaults so future tables/sequences created by postgres superuser are accessible
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO pdseducation_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO pdseducation_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO pdseducation_backup;
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO pdseducation_backup;

-- Backup user: read-only (SELECT on all tables/sequences)
GRANT USAGE ON SCHEMA public TO pdseducation_backup;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO pdseducation_backup;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO pdseducation_backup;

-- Revoke PUBLIC defaults (belt-and-suspenders)
REVOKE ALL ON DATABASE "pdseducation_db" FROM PUBLIC;
REVOKE CREATE ON SCHEMA public FROM PUBLIC;
