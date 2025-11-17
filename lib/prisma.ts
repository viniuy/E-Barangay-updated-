import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Helper function to resolve the best database connection string for runtime usage.
// For the Next.js app we should favor the Supabase connection pooler (6543).
function getRuntimeConnectionUrl(): string {
  // Priority 1: explicit runtime datasource
  if (process.env.DATABASE_URL_POSTGRES_PRISMA_URL) {
    return ensureSsl(process.env.DATABASE_URL_POSTGRES_PRISMA_URL)
  }

  // Priority 2: generic DATABASE_URL
  if (process.env.DATABASE_URL) {
    return ensureSsl(process.env.DATABASE_URL)
  }

  // Priority 3: fall back to direct/non-pooling URLs (not ideal for app runtime but better than failing)
  if (process.env.DIRECT_URL) {
    return ensureSsl(process.env.DIRECT_URL)
  }

  if (process.env.DATABASE_URL_POSTGRES_URL_NON_POOLING) {
    return ensureSsl(process.env.DATABASE_URL_POSTGRES_URL_NON_POOLING)
  }

  throw new Error(
    'Database URL not found. Please set DATABASE_URL_POSTGRES_PRISMA_URL or DATABASE_URL in your .env file'
  )
}

function ensureSsl(url: string): string {
  if (url.includes('sslmode=')) {
    return url
  }
  return url + (url.includes('?') ? '&' : '?') + 'sslmode=require'
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getRuntimeConnectionUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma

