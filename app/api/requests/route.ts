import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const userId = searchParams.get('userId')
    const status = searchParams.get('status')

    if (id) {
      const request = await prisma.request.findUnique({
        where: { id },
        include: {
          item: {
            include: {
              category: true,
            },
          },
          actions: true,
        },
      })

      if (!request) {
        return NextResponse.json({ error: 'Request not found' }, { status: 404 })
      }

      return NextResponse.json(request)
    }

    let where: any = {}

    if (userId) {
      where.userId = userId
    }

    if (status) {
      where.status = status
    }

    const requests = await prisma.request.findMany({
      where,
      include: {
        item: {
          include: {
            category: true,
          },
        },
        user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
        actions: {
          orderBy: { actionDate: 'desc' },
        },
      },
      orderBy: { submittedAt: 'desc' },
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching requests:', error)
    return NextResponse.json(
      { error: 'Failed to fetch requests' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, itemId, reason } = body

    if (!userId || !itemId) {
      return NextResponse.json(
        { error: 'userId and itemId are required' },
        { status: 400 }
      )
    }

    const newRequest = await prisma.request.create({
      data: {
        userId,
        itemId,
        reason: reason || null,
        status: 'pending',
      },
      include: {
        item: {
          include: {
            category: true,
          },
        },
      },
    })

    return NextResponse.json(newRequest, { status: 201 })
  } catch (error) {
    console.error('Error creating request:', error)
    return NextResponse.json(
      { error: 'Failed to create request' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, status, remarks, adminUserId } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Request id is required' },
        { status: 400 }
      )
    }

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      )
    }

    // Update request status
    const updatedRequest = await prisma.request.update({
      where: { id },
      data: {
        status,
        updatedAt: new Date(),
      },
      include: {
        item: {
          include: {
            category: true,
          },
        },
        actions: true,
      },
    })

    // Create request action if adminUserId is provided
    if (adminUserId) {
      await prisma.requestAction.create({
        data: {
          requestId: id,
          adminUserId,
          actionType: status,
          remarks: remarks || null,
          actionDate: new Date(),
        },
      })

      // Fetch updated request with new action
      const requestWithAction = await prisma.request.findUnique({
        where: { id },
        include: {
          item: {
            include: {
              category: true,
            },
          },
          actions: {
            orderBy: { actionDate: 'desc' },
          },
        },
      })

      return NextResponse.json(requestWithAction)
    }

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error('Error updating request:', error)
    return NextResponse.json(
      { error: 'Failed to update request' },
      { status: 500 }
    )
  }
}

