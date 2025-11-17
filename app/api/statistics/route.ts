import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET() {
  try {

    // Note: In your database, 'type' stores processing time, not service/facility
    // So we count all available items as services (since they're all services)
    const [totalServices, totalFacilities, totalRequests, approvedRequests, rejectedRequests] = await Promise.all([
      prisma.item.count({
        where: { status: 'available' }, // All available items are services
      }),
      prisma.item.count({
        where: { status: 'available' }, // For now, same as services (no facilities in your data)
      }),
      prisma.request.count(),
      prisma.request.count({
        where: { status: 'approved' },
      }),
      prisma.request.count({
        where: { status: 'rejected' },
      }),
    ])

    // Get top requested item
    const topItem = await prisma.request.groupBy({
      by: ['itemId'],
      _count: {
        itemId: true,
      },
      orderBy: {
        _count: {
          itemId: 'desc',
        },
      },
      take: 1,
    })

    const topItemId = topItem[0]?.itemId || null

    return NextResponse.json({
      totalServices,
      totalFacilities,
      totalRequests,
      approvedRequests,
      rejectedRequests,
      topItemId,
    })
  } catch (error) {
    console.error('Error fetching statistics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}

