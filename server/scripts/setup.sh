#!/bin/bash

# Setup script for HyperGo URL shortener service

# Function to check if we should import from JSON
ask_import_json() {
  read -p "Do you want to import existing shortcuts from JSON? (y/n): " answer
  case ${answer:0:1} in
    y|Y )
      echo "Setting up for JSON import..."
      # Update the environment in docker-compose.yml
      sed -i 's/IMPORT_FROM_JSON=false/IMPORT_FROM_JSON=true/g' ../../docker-compose.yml
      ;;
    * )
      echo "Skipping JSON import."
      ;;
  esac
}

# Start database and Redis services first
echo "Starting database and Redis services..."
docker compose up -d db redis

# Wait for PostgreSQL to start
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Execute migration script
echo "Running database migrations..."
docker compose exec db psql -U postgres -d hypergo -f /scripts/migration.sql

# Ask about JSON import
ask_import_json

# Start the remaining services
echo "Starting server services..."
docker compose up -d hypergo-server hypergo-frontend

echo "Setup complete! The HyperGo service is now running."
echo "You can access it at: http://localhost"
echo ""
echo "To view logs, run: docker compose logs -f" 