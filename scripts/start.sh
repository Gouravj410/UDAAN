#!/bin/bash

echo "Starting U.D.A.A.N Platform..."

# Check if Docker is available
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed"
    exit 1
fi

# Start services
docker-compose up -d

echo "Waiting for services to start..."
sleep 10

# Check health
echo "Checking service health..."
curl -s http://localhost:3000/api/health/health || echo "Backend not yet ready"

echo ""
echo "✓ Services started successfully!"
echo ""
echo "Available endpoints:"
echo "  Frontend:    http://localhost:5173"
echo "  API:         http://localhost:3000"
echo "  API Docs:    http://localhost:3000/api/docs"
echo "  Keycloak:    http://localhost:8080"
echo ""
echo "Run 'docker-compose logs -f' to view logs"
