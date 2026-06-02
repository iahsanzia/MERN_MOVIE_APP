#!/bin/bash
set -e

echo "Installing backend dependencies..."
npm --prefix backend install

echo "Installing frontend dependencies..."
npm --prefix frontend install

echo "Building backend..."
npm --prefix backend run build

echo "Building frontend..."
npm --prefix frontend run build

echo "Build complete!"
