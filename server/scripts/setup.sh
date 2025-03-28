#!/bin/bash

# Setup script for HyperGo URL shortener service

# Start all services
echo "Starting services..."
docker-compose up -d

# Wait for PostgreSQL to start
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Execute migration script
echo "Running database migrations..."
docker-compose exec db psql -U postgres -d hypergo -f /scripts/migration.sql

# Import data if needed
echo "Setup complete! The HyperGo service is now running."
echo "You can access it at: http://localhost"
echo ""
echo "To view logs, run: docker-compose logs -f" 