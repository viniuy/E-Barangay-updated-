import axiosInstance from '@/lib/axios'
import { Category } from '@/lib/database.types'

export async function getCategories(): Promise<Category[]> {
  const response = await axiosInstance.get('/categories')
  return response.data
}

export async function getCategoryById(id: string): Promise<Category | null> {
  try {
    const response = await axiosInstance.get(`/categories?id=${id}`)
    return response.data
  } catch (error: any) {
    if (error.response?.status === 404) {
      return null
    }
    throw error
  }
}

