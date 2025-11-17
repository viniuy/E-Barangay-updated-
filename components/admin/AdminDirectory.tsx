'use client'

import { useState, useMemo, useEffect } from 'react'
import { Header } from './AdminHeader'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { useItems, useCategories } from '@/lib/hooks/useItems'
import { 
  Search, 
  Clock,
  FileText,
  HeartPulseIcon,
  Building,
  Car,
  Users,
  Star,
  Calendar,
  Hammer,
  Home,
  FileCheck,
  Hospital,
  Accessibility,
  User,
  Shield,
  Lock,
  MapPin
} from 'lucide-react'
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import * as L from "leaflet"
import Footer from "../Footer"

interface AdminDirectoryProps {
  onNavigate: (view: 'dashboard' | 'directory' | 'requests') => void
}

const iconMap: Record<string, any> = {
  'default': FileCheck,
  'clearance': FileCheck,
  'permit': Building,
  'construction': Hammer,
  'residency': Home,
  'indigency': Users,
  'health': HeartPulseIcon,
  'tricycle': Car,
  'referral': Hospital,
  'senior': Accessibility,
  'solo': User,
  'blotter': Shield,
  'protection': Lock,
}

export function AdminDirectory({ onNavigate }: AdminDirectoryProps) {
  const { items: allItems, loading } = useItems()
  const { categories } = useCategories()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('alphabetical')
  const [activeTab, setActiveTab] = useState<'services' | 'facilities'>('services')

  // Fix for Leaflet default icon in Next.js
  useEffect(() => {
    if (typeof window !== 'undefined') {
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })
    }
  }, [])

  // Filter items based on active tab
  // Since type stores processing time, we'll show all items for both tabs
  // You can adjust this logic based on your actual data structure
  const items = useMemo(() => {
    return allItems.filter(item => {
      // For now, show all items in both tabs
      // You can add logic here to distinguish services from facilities if needed
      return item.status === 'available'
    })
  }, [allItems])

  const categoryOptions = useMemo(() => {
    const allOption = { id: 'all', label: `All ${activeTab === 'services' ? 'Services' : 'Facilities'}`, count: items.length }
    const categoryOptions = categories.map(cat => ({
      id: cat.id,
      label: cat.name,
      count: items.filter(item => (item as any).categoryId === cat.id || (item as any).category_id === cat.id).length
    }))
    return [allOption, ...categoryOptions]
  }, [categories, items, activeTab])

  const filteredItems = useMemo(() => {
    let filtered = items.filter(item => {
      const matchesSearch = item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           false
      const itemCategoryId = (item as any).categoryId || (item as any).category_id
      const matchesCategory = selectedCategory === 'all' || itemCategoryId === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'alphabetical':
          return (a.name || '').localeCompare(b.name || '')
        case 'category':
          return (a.category?.name || '').localeCompare(b.category?.name || '')
        default:
          return 0
      }
    })

    return filtered
  }, [items, searchTerm, selectedCategory, sortBy])

  const featuredItems = filteredItems.slice(0, 6)

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header onNavigate={onNavigate} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading...</div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onNavigate={onNavigate} />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Services & Facilities Directory</h1>
          <p className="text-muted-foreground">Manage and view all available services and facilities</p>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'services' | 'facilities')} className="mb-6">
          <TabsList>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="facilities">Facilities</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-6">
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Services List */}
              <div className="space-y-4">
                {filteredItems.map((item) => {
                  const itemNameLower = item.name?.toLowerCase() || ''
                  const iconKey = Object.keys(iconMap).find(key => 
                    itemNameLower.includes(key)
                  ) || 'default'
                  const IconComponent = iconMap[iconKey]
                  
                  return (
                    <Card key={item.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex space-x-4 flex-1">
                            <div className="p-2 rounded-lg">
                              <IconComponent className="h-10 w-10 text-blue-800" />
                            </div>
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
                              <p className="text-gray-600 mb-3">{item.description}</p>
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center text-sm text-gray-700">
                                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                  <span>{item.type || 'N/A'}</span>
                                </div>
                                {item.category && (
                                  <Badge variant="secondary">
                                    {item.category.name}
                                  </Badge>
                                )}
                                <Badge variant={item.availability === "24/7" ? "default" : "secondary"}>
                                  {item.availability || 'Business hours'}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 text-sm text-gray-700 ml-6 w-40">
                            <div className="flex items-center justify-center border border-gray-300 rounded-md px-2 py-1 bg-white">
                              <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{(item as any).bookingRules || (item as any).booking_rules || 'Check fee'}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">No services found</div>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="facilities" className="mt-6">
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search facilities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.label} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Facilities Map and List */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Map */}
                <div className="h-[500px] rounded-lg overflow-hidden border">
                  <MapContainer
                    center={[14.5995, 120.9842]} // Default to Manila, adjust as needed
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {filteredItems.map((item) => (
                      <Marker
                        key={item.id}
                        position={[14.5995, 120.9842]} // You'll need to add coordinates to your items
                      >
                        <Popup>
                          <div>
                            <h3 className="font-semibold">{item.name}</h3>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </div>

                {/* Facilities List */}
                <div className="space-y-4 max-h-[500px] overflow-y-auto">
                  {filteredItems.map((item) => {
                    const itemNameLower = item.name?.toLowerCase() || ''
                    const iconKey = Object.keys(iconMap).find(key => 
                      itemNameLower.includes(key)
                    ) || 'default'
                    const IconComponent = iconMap[iconKey]
                    
                    return (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className="p-2 rounded-lg">
                              <IconComponent className="h-8 w-8 text-blue-800" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold mb-1">{item.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                              <div className="flex items-center space-x-2 text-sm">
                                <MapPin className="h-4 w-4 text-gray-500" />
                                <span className="text-gray-700">{item.availability || 'Location'}</span>
                              </div>
                              {item.category && (
                                <Badge variant="secondary" className="mt-2">
                                  {item.category.name}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {filteredItems.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">No facilities found</div>
                  <p className="text-gray-600">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  )
}

