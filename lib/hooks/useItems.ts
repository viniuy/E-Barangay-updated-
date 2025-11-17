'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ItemWithCategory } from '@/lib/database.types'

export function useItems(type?: 'service' | 'facility') {
  const [items, setItems] = useState<ItemWithCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true)
        const supabase = createClient()
        
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

        const { data, error: fetchError } = await query

        if (fetchError) throw fetchError
        setItems(data || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch items'))
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [type])

  return { items, loading, error }
}

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true)
        const supabase = createClient()
        
        const { data, error: fetchError } = await supabase
          .from('categories')
          .select('*')
          .order('name', { ascending: true })

        if (fetchError) throw fetchError
        setCategories(data || [])
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch categories'))
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

