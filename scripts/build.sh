#!/bin/bash

echo "Building U.D.A.A.N Platform..."

# Backend
cd backend
npm install
npm run build
echo "✓ Backend built successfully"

# Frontend
cd ../frontend
npm install
npm run build
echo "✓ Frontend built successfully"

echo "✓ All builds complete!"
