import { defineConfig } from 'drizzle-kit'

import { env } from './src/main/config/env'

export default defineConfig({
  schema: './src/main/database/schema.ts',
  out: './src/main/database/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
