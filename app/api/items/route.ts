import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const id = searchParams.get('id')
    const type = searchParams.get('type') // This is actually processing time, not service/facility
    const categoryId = searchParams.get('categoryId')
    const search = searchParams.get('search')

    if (id) {
      const item = await prisma.item.findUnique({
        where: { id },
        include: {
          category: true,
        },
      })

      if (!item) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 })
      }

      return NextResponse.json(item)
    }

    let where: any = {
      status: 'available', // Filter by available status
    }

    // Note: 'type' in your database stores processing time (e.g., '1-2 days'), not 'service'/'facility'
    // So we ignore the type parameter for service/facility distinction
    // If you want to filter by processing time, you can use it here:
    // if (type && (type === '1-2 days' || type === '2-3 days' || type === 'Same day')) {
    //   where.type = type
    // }

    if (categoryId) {
      where.categoryId = categoryId
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const items = await prisma.item.findMany({
      where,
      include: {
        category: true,
      },
      orderBy: { name: 'asc' },
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/items — Create new item
 */
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    const item = await prisma.item.create({
      data,
    })

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("POST error:", error)
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 })
  }
}


/**
 * PATCH /api/items — Update item
 */
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...data } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Missing item ID' },
        { status: 400 }
      )
    }

    const updatedItem = await prisma.item.update({
      where: { id },
      data,
    })

    return NextResponse.json(updatedItem)
  } catch (error) {
    console.error('Error updating item:', error)
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    )
  }
}


/**
 * DELETE /api/items?id=xxx
 */
export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing item ID" }, { status: 400 })
    }

    await prisma.item.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE error:", error)
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 })
  }
}

