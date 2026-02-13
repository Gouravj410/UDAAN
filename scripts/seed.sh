#!/bin/bash

echo "Seeding database with test data..."

docker-compose exec backend npm run seed

echo "✓ Database seeded"
