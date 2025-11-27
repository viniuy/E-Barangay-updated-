'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { createSession as createSessionBase, getSession as getSessionBase, deleteSession as deleteSessionBase } from '@/lib/auth/session'
import { randomUUID } from 'crypto'
import { Barangay } from '@prisma/client'

// ⭐ Convert frontend strings → Prisma enum
const barangayMap = {
  "Molino I": "Molino_I",
  "Molino II": "Molino_II",
  "Molino III": "Molino_III",
  "Molino IV": "Molino_IV",
} as const

export type BarangayKey = keyof typeof barangayMap // "Molino I" | "Molino II" | "Molino III" | "Molino IV"

// -----------------
// Session User type
// -----------------
export type SessionUser = {
  id: string
  email: string
  username: string
  role: string
  barangay: Barangay
}

// -----------------
// Sign up
// -----------------
export async function signUp(
  email: string,
  password: string,
  username: string,
  barangay: BarangayKey
) {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  })

  if (existingUser) return { error: 'User with this email or username already exists' }

  const hashedPassword = await bcrypt.hash(password, 10)

  const prismaBarangay = barangayMap[barangay]
  if (!prismaBarangay) return { error: `Invalid barangay: ${barangay}` }

  try {
    const user = await prisma.user.create({
      data: {
        id: randomUUID(),
        email,
        username,
        password: hashedPassword,
        userRole: 'resident',
        barangay: prismaBarangay as Barangay,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    // ✅ Only pass userId to session
    await createSessionBase(user.id)

    revalidatePath('/')
    return { user }
  } catch (dbError: any) {
    console.error('Error creating user:', dbError)
    return { error: 'Failed to create user. Please try again.' }
  }
}

// -----------------
// Sign in
// -----------------
export async function signIn(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, username: true, password: true, userRole: true, barangay: true },
  })

  if (!user) return { error: 'Invalid email or password' }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) return { error: 'Invalid email or password' }

  await createSessionBase(user.id) // ✅ only userId

  revalidatePath('/')
  return {
    user,
    role: user.userRole || 'resident',
  }
}

// -----------------
// Get current user
// -----------------
export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await getSessionBase()
  if (!session) return null

  // Fetch full user from DB
  const user = await prisma.user.findUnique({
    where: { id: session.user.id }, // session stores a user object with an id
    select: {
      id: true,
      email: true,
      username: true,
      userRole: true,
      barangay: true,
    },
  })

  if (!user) return null

  return {
    id: user.id,
    email: user.email,
    username: user.username,
    barangay: user.barangay,
    role: user.userRole || 'resident',
  }
}

// -----------------
// Sign out
// -----------------
export async function signOut() {
  await deleteSessionBase()
  revalidatePath('/')
  redirect('/')
}