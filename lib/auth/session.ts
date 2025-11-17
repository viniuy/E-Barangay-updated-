import { cookies } from 'next/headers'
import prisma from '@/lib/prisma'

const SESSION_COOKIE_NAME = 'session_token'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function createSession(userId: string) {
  const cookieStore = await cookies()
  
  // Generate a simple session token (in production, use a more secure method)
  const sessionToken = `${userId}-${Date.now()}-${Math.random().toString(36).substring(7)}`
  
  cookieStore.set(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  return sessionToken
}

export async function getSession() {
  const cookieStore = await cookies()
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (!sessionToken) {
    return null
  }

  // Extract user ID from session token
  const userId = sessionToken.split('-')[0]

  if (!userId) {
    return null
  }

  // Verify user exists in database
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      username: true,
      userRole: true,
    },
  })

  if (!user) {
    return null
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.userRole,
    },
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE_NAME)
}

