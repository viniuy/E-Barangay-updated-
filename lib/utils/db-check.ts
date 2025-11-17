'use server'

import prisma from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

/**
 * Check if database connection is working
 * Use this to verify your Prisma database connection
 */
export async function checkDatabaseConnection() {
  try {
    // Test query - try to fetch categories using Prisma
    await prisma.category.findFirst()

    return {
      connected: true,
      message: 'Database connection successful!'
    }
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to connect to database. Please check your environment variables.'
    }
  }
}

/**
 * Check if authentication is properly configured
 */
export async function checkAuthConfiguration() {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    return {
      configured: !error,
      hasUser: !!user,
      error: error?.message,
    }
  } catch (error) {
    return {
      configured: false,
      hasUser: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

