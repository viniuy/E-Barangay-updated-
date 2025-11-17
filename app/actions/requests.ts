'use server'

import { createClient } from '@/lib/supabase/server'
import { Request, RequestWithDetails, RequestStatus } from '@/lib/database.types'
import { revalidatePath } from 'next/cache'

export async function createRequest(
  userId: string,
  itemId: string,
  reason?: string
): Promise<Request> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('requests')
    .insert({
      user_id: userId,
      item_id: itemId,
      status: 'pending',
      reason: reason || null,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating request:', error)
    throw new Error('Failed to create request')
  }

  revalidatePath('/')
  return data
}

export async function getUserRequests(userId: string): Promise<RequestWithDetails[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('requests')
    .select(`
      *,
      item:items(
        *,
        category:categories(*)
      ),
      actions:request_actions(*)
    `)
    .eq('user_id', userId)
    .order('submitted_at', { ascending: false })

  if (error) {
    console.error('Error fetching user requests:', error)
    throw new Error('Failed to fetch requests')
  }

  return data || []
}

export async function getRequestById(requestId: string): Promise<RequestWithDetails | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('requests')
    .select(`
      *,
      item:items(
        *,
        category:categories(*)
      ),
      actions:request_actions(*)
    `)
    .eq('id', requestId)
    .single()

  if (error) {
    console.error('Error fetching request:', error)
    return null
  }

  return data
}

export async function updateRequestStatus(
  requestId: string,
  status: RequestStatus,
  adminUserId: string,
  remarks?: string
): Promise<void> {
  const supabase = await createClient()
  
  // Update request status
  const { error: requestError } = await supabase
    .from('requests')
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq('id', requestId)

  if (requestError) {
    console.error('Error updating request:', requestError)
    throw new Error('Failed to update request')
  }

  // Create request action
  const { error: actionError } = await supabase
    .from('request_actions')
    .insert({
      request_id: requestId,
      admin_user_id: adminUserId,
      action_type: status,
      remarks: remarks || null,
    })

  if (actionError) {
    console.error('Error creating request action:', actionError)
    throw new Error('Failed to create request action')
  }

  revalidatePath('/')
}

export async function getAllRequests(): Promise<RequestWithDetails[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('requests')
    .select(`
      *,
      item:items(
        *,
        category:categories(*)
      ),
      actions:request_actions(*)
    `)
    .order('submitted_at', { ascending: false })

  if (error) {
    console.error('Error fetching all requests:', error)
    throw new Error('Failed to fetch requests')
  }

  return data || []
}

