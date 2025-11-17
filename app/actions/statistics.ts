'use server'

import { createClient } from '@/lib/supabase/server'
import { Statistics } from '@/lib/database.types'

export async function getStatistics(): Promise<{
  totalRequests: number
  approvedCount: number
  rejectedCount: number
  pendingCount: number
  totalItems: number
  totalServices: number
  totalFacilities: number
}> {
  const supabase = await createClient()
  
  // Get request counts
  const { data: requests, error: requestsError } = await supabase
    .from('requests')
    .select('status')

  if (requestsError) {
    console.error('Error fetching request statistics:', requestsError)
    throw new Error('Failed to fetch statistics')
  }

  const totalRequests = requests?.length || 0
  const approvedCount = requests?.filter(r => r.status === 'approved').length || 0
  const rejectedCount = requests?.filter(r => r.status === 'rejected').length || 0
  const pendingCount = requests?.filter(r => r.status === 'pending').length || 0

  // Get item counts
  const { data: items, error: itemsError } = await supabase
    .from('items')
    .select('type, status')
    .eq('status', 'available')

  if (itemsError) {
    console.error('Error fetching item statistics:', itemsError)
    throw new Error('Failed to fetch statistics')
  }

  const totalItems = items?.length || 0
  const totalServices = items?.filter(i => i.type === 'service').length || 0
  const totalFacilities = items?.filter(i => i.type === 'facility').length || 0

  return {
    totalRequests,
    approvedCount,
    rejectedCount,
    pendingCount,
    totalItems,
    totalServices,
    totalFacilities,
  }
}

export async function getLatestStatistics(): Promise<Statistics | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('statistics')
    .select('*')
    .order('date_recorded', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching latest statistics:', error)
    return null
  }

  return data
}

