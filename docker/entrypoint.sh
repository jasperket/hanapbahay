#!/bin/bash
set -e

# Read the password from the mounted Docker secret
export MSSQL_SA_PASSWORD=$(cat /run/secrets/db_password)

echo "Starting SQL Server with password from secret..."
exec /opt/mssql/bin/sqlservr
