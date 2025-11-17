import axiosInstance from '@/lib/axios'

export async function getStatistics(): Promise<{
  totalRequests: number
  approvedRequests: number
  rejectedRequests: number
  totalServices: number
  totalFacilities: number
  topItemId: string | null
}> {
  const response = await axiosInstance.get('/statistics')
  return response.data
}

