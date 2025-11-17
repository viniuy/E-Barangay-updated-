'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { createSession, getSession, deleteSession } from '@/lib/auth/session'
import { randomUUID } from 'crypto'

export async function signUp(email: string, password: string, username: string) {
  // Check if user already exists in database
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email },
        { username },
      ],
    },
  })

  if (existingUser) {
    return { error: 'User with this email or username already exists' }
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create user in database
  try {
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        email,
        username,
        password: hashedPassword,
        userRole: 'resident', // Default role is resident
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // Create session
    await createSession(user.id)

    revalidatePath('/')
    return { 
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      }
    }
  } catch (dbError: any) {
    console.error('Error creating user:', dbError)
    return { error: 'Failed to create user. Please try again.' }
  }
}

export async function signIn(email: string, password: string) {
  // Find user by email
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      password: true,
      userRole: true,
    },
  })

  if (!user) {
    return { error: 'Invalid email or password' }
  }

  // Verify password
  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    return { error: 'Invalid email or password' }
  }

  // Create session
  await createSession(user.id)

  revalidatePath('/')
  return { 
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    role: user.userRole || 'resident'
  }
}

export async function signOut() {
  await deleteSession()
  revalidatePath('/')
  redirect('/')
}

export async function getCurrentUser() {
  const session = await getSession()
  
  if (!session) {
    return null
  }

  return {
    id: session.user.id,
    email: session.user.email,
    username: session.user.username,
    role: session.user.role || 'resident',
  }
}

