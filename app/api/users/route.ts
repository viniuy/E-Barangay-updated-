import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSession } from '@/lib/auth/session'
import { randomUUID } from 'crypto'
import { Barangay } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Frontend → Prisma enum mapping
const barangayMap = {
  "Molino I": "Molino_I",
  "Molino II": "Molino_II",
  "Molino III": "Molino_III",
  "Molino IV": "Molino_IV",
} as const

type BarangayKey = keyof typeof barangayMap // "Molino I" | "Molino II" | "Molino III" | "Molino IV"

// Helper to map frontend string to Prisma enum
const prismaBarangay = (barangay: BarangayKey) => barangayMap[barangay]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, username, password, authUserId, barangay } = body

    if (!email || !username || !barangay) {
      return NextResponse.json(
        { error: 'Email, username, and barangay are required' },
        { status: 400 }
      )
    }

    if (!Object.keys(barangayMap).includes(barangay)) {
      return NextResponse.json(
        { error: `Invalid barangay: ${barangay}` },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email or username already exists' },
        { status: 409 }
      )
    }

    // Hash password (replace placeholder with proper hash in production)
    const hashedPassword = password ? await bcrypt.hash(password, 10) : 'hashed_password_placeholder'

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        id: authUserId || randomUUID(),
        email,
        username,
        password: hashedPassword,
        userRole: 'resident',
        barangay: prismaBarangay(barangay as BarangayKey) as Barangay,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const email = searchParams.get('email')
    const username = searchParams.get('username')

    let user

    if (id) {
      user = await prisma.user.findUnique({ where: { id } })
    } else if (email) {
      user = await prisma.user.findUnique({ where: { email } })
    } else if (username) {
      user = await prisma.user.findUnique({ where: { username } })
    } else {
      // Get current authenticated user from session
      const session = await getSession()
      if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

      user = await prisma.user.findUnique({ where: { id: session.user.id } })
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user' },
      { status: 500 }
    )
  }
}
