'use server'

import { createClient } from '@/lib/supabase/server'
import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function signUp(email: string, password: string, username: string) {
  const supabase = await createClient()

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

  // Sign up the user with Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username: username,
      },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: 'Failed to create user' }
  }

  // Save user to database using Prisma with default role 'resident'
  try {
    await prisma.user.create({
      data: {
        id: authData.user.id, // Use the same ID from Supabase Auth
        email: authData.user.email!,
        username: username,
        password: 'hashed_password_placeholder', // Password is handled by Supabase Auth
        userRole: 'resident', // Default role is resident
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })
  } catch (dbError: any) {
    // If user creation fails (e.g., trigger already created it), that's okay
    // The database trigger might have already created the user
    console.log('User might already exist in database (trigger may have created it):', dbError.message)
    
    // Verify the user exists and update role if needed
    const userExists = await prisma.user.findUnique({
      where: { id: authData.user.id },
    })

    if (!userExists) {
      return { error: 'Failed to save user to database' }
    }

    // Update role if it wasn't set (for existing users)
    if (!userExists.userRole) {
      await prisma.user.update({
        where: { id: authData.user.id },
        data: { userRole: 'resident' },
      })
    }
  }

  revalidatePath('/')
  return { user: authData.user }
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  if (!data.user) {
    return { error: 'Failed to sign in' }
  }

  // Get user role from database
  const dbUser = await prisma.user.findUnique({
    where: { id: data.user.id },
    select: { userRole: true },
  })

  revalidatePath('/')
  return { 
    user: data.user,
    role: dbUser?.userRole || 'resident' // Default to resident if role not found
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/')
  redirect('/')
}

export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  // Get user with role from database
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { userRole: true, username: true, email: true },
  })

  return {
    ...user,
    role: dbUser?.userRole || 'resident',
    username: dbUser?.username,
  }
}

