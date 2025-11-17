'use server'

import { createClient } from '@/lib/supabase/server'
import { Item, ItemWithCategory, ItemStatus } from '@/lib/database.types'
import { revalidatePath } from 'next/cache'

export async function getItems(type?: 'service' | 'facility'): Promise<ItemWithCategory[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('items')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('status', 'available')
    .order('name', { ascending: true })

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching items:', error)
    throw new Error('Failed to fetch items')
  }

  return data || []
}

export async function getItemById(id: string): Promise<ItemWithCategory | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('items')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching item:', error)
    return null
  }

  return data
}

export async function getItemsByCategory(categoryId: string, type?: 'service' | 'facility'): Promise<ItemWithCategory[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('items')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('category_id', categoryId)
    .eq('status', 'available')
    .order('name', { ascending: true })

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching items by category:', error)
    throw new Error('Failed to fetch items')
  }

  return data || []
}

export async function searchItems(searchTerm: string, type?: 'service' | 'facility'): Promise<ItemWithCategory[]> {
  const supabase = await createClient()
  
  let query = supabase
    .from('items')
    .select(`
      *,
      category:categories(*)
    `)
    .eq('status', 'available')
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .order('name', { ascending: true })

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error searching items:', error)
    throw new Error('Failed to search items')
  }

  return data || []
}

