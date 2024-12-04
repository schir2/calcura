#!/bin/bash

# Function to display a message and exit on error
function exit_on_error() {
    echo "Error: $1"
    exit 1
}

# Update and install PostgreSQL
echo "Updating package list and installing PostgreSQL..."
sudo apt update || exit_on_error "Failed to update package list."
sudo apt install -y postgresql postgresql-contrib || exit_on_error "Failed to install PostgreSQL."

# Start PostgreSQL service
echo "Starting PostgreSQL service..."
sudo service postgresql start || exit_on_error "Failed to start PostgreSQL service."

# Collect database configuration from user
read -p "Enter the PostgreSQL username to create (default: prisma_user): " PG_USER
PG_USER=${PG_USER:-prisma_user}

read -p "Enter the password for user $PG_USER: " -s PG_PASSWORD
echo
read -p "Enter the database name to create (default: prisma_db): " PG_DB
PG_DB=${PG_DB:-prisma_db}

# Switch to postgres user and create the database and user
echo "Creating database and user..."
sudo -i -u postgres psql <<SQL
CREATE USER $PG_USER WITH PASSWORD '$PG_PASSWORD';
CREATE DATABASE $PG_DB OWNER $PG_USER;
GRANT ALL PRIVILEGES ON DATABASE $PG_DB TO $PG_USER;
SQL

# Confirm success
if [ $? -eq 0 ]; then
    echo "PostgreSQL setup completed successfully!"
    echo "Database: $PG_DB"
    echo "Username: $PG_USER"
    echo "Password: [hidden]"
else
    exit_on_error "Failed to set up PostgreSQL database and user."
fi
