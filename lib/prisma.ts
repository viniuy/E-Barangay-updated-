import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Helper function to convert Supabase pooler URL to direct connection URL
function getDirectConnectionUrl(): string {
  // Priority 1: DIRECT_URL (standard Prisma convention)
  if (process.env.DIRECT_URL) {
    return process.env.DIRECT_URL
  }

  // Priority 2: DATABASE_URL_POSTGRES_URL_NON_POOLING (Supabase format)
  if (process.env.DATABASE_URL_POSTGRES_URL_NON_POOLING) {
    return process.env.DATABASE_URL_POSTGRES_URL_NON_POOLING
  }

  // Priority 3: DATABASE_URL (standard Prisma convention)
  const dbUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_POSTGRES_PRISMA_URL
  if (!dbUrl) {
    throw new Error('Database URL not found. Please set DIRECT_URL, DATABASE_URL_POSTGRES_URL_NON_POOLING, or DATABASE_URL in your .env file')
  }

  // Convert pooler URL (port 6543) to direct connection (port 5432)
  // Supabase direct connection uses the session pooler on port 5432
  // This converts: aws-1-us-east-1.pooler.supabase.com:6543 -> aws-1-us-east-1.pooler.supabase.com:5432
  let directUrl = dbUrl
    .replace(':6543', ':5432')
    .replace('?pgbouncer=true', '')
    .replace('&pgbouncer=true', '')
  
  // Ensure sslmode=require is present for secure connections
  if (!directUrl.includes('sslmode=')) {
    directUrl += (directUrl.includes('?') ? '&' : '?') + 'sslmode=require'
  }

  return directUrl
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDirectConnectionUrl(),
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma

