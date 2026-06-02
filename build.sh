#!/bin/bash
set -e

echo "Installing backend dependencies..."
cd backend
npm install
cd ..

echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "Building backend..."
cd backend
npm run build -- --noUnusedParameters false --noUnusedLocals false
cd ..

echo "Building frontend..."
cd frontend
npm run build
cd ..

echo "Build complete!"