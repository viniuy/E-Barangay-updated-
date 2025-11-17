'use server'

import { createClient } from '@/lib/supabase/server'
import { Category } from '@/lib/database.types'
import { revalidatePath } from 'next/cache'

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }

  return data || []
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data
}

