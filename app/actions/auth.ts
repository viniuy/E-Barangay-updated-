'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { createSession, getSession, deleteSession } from '@/lib/auth/session'
import { randomUUID } from 'crypto'
import { Barangay } from '@prisma/client'

// ⭐ Convert frontend strings → Prisma enum
const barangayMap = {
  "Molino I": "Molino_I",
  "Molino II": "Molino_II",
  "Molino III": "Molino_III",
  "Molino IV": "Molino_IV",
} as const

// ==========================
// SIGN UP
// ==========================
export async function signUp(
  email: string,
  password: string,
  username: string,
  barangay: string
) {
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

  const hashedPassword = await bcrypt.hash(password, 10)

  try {
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        email,
        username,
        password: hashedPassword,
        userRole: 'resident',

        // ⭐ Convert to Prisma Enum
        barangay: barangayMap[barangay] as Barangay,

        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    await createSession(user.id)

    revalidatePath('/')

    return {
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        barangay: user.barangay,
      }
    }
  } catch (dbError: any) {
    console.error('Error creating user:', dbError)
    return { error: 'Failed to create user. Please try again.' }
  }
}

// ==========================
// SIGN IN
// ==========================
export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      username: true,
      password: true,
      userRole: true,
      barangay: true,
    },
  })

  if (!user) {
    return { error: 'Invalid email or password' }
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    return { error: 'Invalid email or password' }
  }

  await createSession(user.id)
  revalidatePath('/')

  return {
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      barangay: user.barangay,
    },
    role: user.userRole || 'resident'
  }
}

// ==========================
// SIGN OUT
// ==========================
export async function signOut() {
  await deleteSession()
  revalidatePath('/')
  redirect('/')
}

// ==========================
// GET CURRENT USER
// ==========================
export async function getCurrentUser() {
  const session = await getSession()

  if (!session) return null

  return {
    id: session.user.id,
    email: session.user.email,
    username: session.user.username,
    barangay: session.user.barangay,
    role: session.user.role || 'resident',
  }
}
