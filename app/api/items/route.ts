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

