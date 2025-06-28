#!/bin/bash

# End-to-End Test Setup and Run Script for Promptyoo

set -e  # Exit on any error

echo "🚀 Setting up End-to-End Tests for Promptyoo..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the e2e-tests directory"
    exit 1
fi

# Check if backend .env file exists
if [ ! -f "../backend/.env" ]; then
    echo "❌ Error: Backend .env file not found!"
    echo "Please create ../backend/.env with DEEPSEEK_API_KEY"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Install Playwright browsers if not already installed
echo "🌐 Installing browsers..."
npx playwright install --with-deps

# Run the tests
echo "🧪 Running End-to-End Tests..."
npm test

echo "✅ Tests completed! Check the HTML report:"
echo "   npm run test:report" 