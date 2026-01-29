#!/bin/bash

# Install dependencies
npm install

# Setup Environment Variables
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env file. Please update DATABASE_URL and JWT_SECRET."
fi

# Generate Prisma Client
npx prisma generate

# Instructions
echo "Setup complete!"
echo "1. Update .env with your PostgreSQL credentials."
echo "2. Run 'npx prisma migrate dev --name init' to create the database tables."
echo "3. Run 'npm run dev' to start the server."
