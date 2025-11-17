'use client'

import { useState, useMemo } from 'react';
import { Header } from './AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useItems, useCategories } from '@/lib/hooks/useItems';
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
  Lock
} from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel"

import Footer from "../Footer";

interface ServiceDirectoryProps {
  onNavigate: (view: 'dashboard' | 'services' | 'facilities' |  'application' | 'requests') => void;
  onSelectService: (service: string) => void;
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

export function ServiceDirectory({ onNavigate, onSelectService }: ServiceDirectoryProps) {
  const { items: services, loading } = useItems('service')
  const { categories } = useCategories()
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('alphabetical');

  const categoryOptions = useMemo(() => {
    const allOption = { id: 'all', label: 'All Services', count: services.length }
    const categoryOptions = categories.map(cat => ({
      id: cat.id,
      label: cat.name,
      count: services.filter(s => s.category_id === cat.id).length
    }))
    return [allOption, ...categoryOptions]
  }, [categories, services])

  const filteredServices = useMemo(() => {
    let filtered = services.filter(service => {
      const matchesSearch = service.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           false
      const matchesCategory = selectedCategory === 'all' || service.category_id === selectedCategory
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
  }, [services, searchTerm, selectedCategory, sortBy])

  const featuredServices = filteredServices.slice(0, 6) // Show first 6 as featured

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading services...</div>
      </div>
    )
  }

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-200 p-6 rounded-lg m-5">
        <Header onNavigate={onNavigate} />
        
        <main className="max-w-7xl mx-auto px-4 py-8">

          {/* SERVICES - Feautured */}
          <div className="mb-8">
            <h2 className="text-2xl mb-4 flex items-center font-semibold justify-center">
              <Star className="h-5 w-5 mr-2 text-yellow-500 fill-current" />
              Featured Services
            </h2>
            <div className="flex justify-center">
              <Carousel className="w-full max-w-4xl">
                <CarouselContent className="px-2">
                  {featuredServices.map((service) => {
                    const serviceNameLower = service.name?.toLowerCase() || ''
                    const iconKey = Object.keys(iconMap).find(key => 
                      serviceNameLower.includes(key)
                    ) || 'default'
                    const IconComponent = iconMap[iconKey]
                    return (
                      <CarouselItem 
                        key={service.id} 
                        className="md:basis-1/2 lg:basis-1/3 px-2"
                      >
                        <Card 
                          className="border-2 border-blue-300 rounded-lg hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                          onClick={() => onSelectService(service.id)}
                        >
                          <CardHeader className="pb-3 text-center">
                            <div className="flex justify-center">
                              <div>
                                <IconComponent className="h-7 w-7 bg-white text-blue-800 rounded-lg" />
                              </div>
                            </div>
                            <CardTitle className="text-lg mt-2">{service.name}</CardTitle>
                            <CardDescription className="text-sm">{service.description}</CardDescription>
                          </CardHeader>
                        
                          <CardContent className="pt-0 mt-auto">
                            <div className="flex items-center justify-between space-x-3">
                              {/* Processing Time Box */}
                              <div className="flex-1 flex items-center justify-center border-1 border-gray-400 rounded-md px-3 py-2 text-sm text-black">
                                <Clock className="h-4 w-4 mr-1" />
                                {service.availability || 'N/A'}
                              </div>

                              {/* Fee Box */}
                              <div className="flex-1 flex items-center justify-center border-1 border-gray-400 rounded-md px-3 py-2 text-sm text-black">
                                Check fee
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <CarouselPrevious className='bg-blue-500 text-white'/>
                <CarouselNext className='bg-blue-500 text-white'/>
              </Carousel>
            </div>
          </div>
          
          <div>
            {/* SERVICES - Search Box */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">All Services ({filteredServices.length})</h2>
            </div>
            {/* Search + Category + Sort Side by Side */}
            <div className="flex items-center gap-4 mb-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search services..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full bg-white"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="w-48">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white">
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
              </div>

              {/* Sort By */}
              <div className="w-48">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Sort By" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          
            {/* SERVICES - Card */}
            <div className="space-y-4">
              {filteredServices.map((service) => {
                const serviceNameLower = service.name?.toLowerCase() || ''
                const iconKey = Object.keys(iconMap).find(key => 
                  serviceNameLower.includes(key)
                ) || 'default'
                const IconComponent = iconMap[iconKey]
                const requirements = service.booking_rules 
                  ? service.booking_rules.split(',').map(r => r.trim()).filter(Boolean)
                  : []
                return (
                <Card
                  key={service.id}
                  className="hover:shadow-md transition-shadow cursor-pointer border-r-5 border-r-blue-700"
                  onClick={() => onSelectService(service.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      
                      {/* Left: Icon, Title, Description, Badges + Processing */}
                      <div className="flex space-x-5 flex-1">
                        {/* Service Icon */}
                        <div className="p-2 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-10 w-10 text-blue-800" />
                        </div>

                        {/* Title + Info */}
                        <div className="flex-1">
                          {/* Title */}
                          <h3 className="text-lg font-semibold mb-1">{service.name}</h3>

                          {/* Description */}
                          <p className="text-gray-600 mb-3">{service.description}</p>

                          {/* Badges + Processing inline */}
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="flex items-center text-sm text-gray-700">
                              <Clock className="h-4 w-4 mr-1 text-gray-500" />
                              <span>{service.availability || 'N/A'}</span>
                            </div>
                            {service.category && (
                              <Badge variant="secondary">
                                {service.category.name}
                              </Badge>
                            )}
                            <Badge
                              variant={service.availability === "24/7" ? "default" : "secondary"}
                            >
                              {service.availability || 'Business hours'}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Right: Fee + Requirements stacked */}
                      <div className="flex flex-col space-y-2 text-sm text-gray-700 ml-6 w-40">
                        <div className="flex items-center justify-center border border-gray-300 rounded-md px-2 py-1 bg-white">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Check fee</span>
                        </div>
                        <div className="flex items-center justify-center border border-gray-300 rounded-md px-2 py-1 bg-white">
                          <FileText className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{requirements.length} requirements</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                );
              })}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-2">No services found</div>
                <p className="text-gray-600">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </div>
        </main>
      </div>
      <div> <Footer /> </div> 
    </div>
  );
}