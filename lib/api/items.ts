import axiosInstance from '@/lib/axios'
import { ItemWithCategory } from '@/lib/database.types'

export async function getItems(type?: 'service' | 'facility'): Promise<ItemWithCategory[]> {
  const params = new URLSearchParams()
  if (type) {
    params.append('type', type)
  }
  const response = await axiosInstance.get(`/items?${params.toString()}`)
  return response.data
}

export async function getItemById(id: string): Promise<ItemWithCategory | null> {
  try {
    const response = await axiosInstance.get(`/items?id=${id}`)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }
    throw error
  }
}

export async function getItemsByCategory(categoryId: string, type?: 'service' | 'facility'): Promise<ItemWithCategory[]> {
  const params = new URLSearchParams()
  params.append('categoryId', categoryId)
  if (type) {
    params.append('type', type)
  }
  const response = await axiosInstance.get(`/items?${params.toString()}`)
  return response.data
}

export async function searchItems(searchTerm: string, type?: 'service' | 'facility'): Promise<ItemWithCategory[]> {
  const params = new URLSearchParams()
  params.append('search', searchTerm)
  if (type) {
    params.append('type', type)
  }
  const response = await axiosInstance.get(`/items?${params.toString()}`)
  return response.data
}

