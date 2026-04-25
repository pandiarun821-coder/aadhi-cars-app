#!/usr/bin/env bash
# exit on error
set -o errexit

npm install
npx prisma generate

export DATABASE_URL="file:$DATABASE_PATH"
npx prisma db push --accept-data-loss

npm run build
