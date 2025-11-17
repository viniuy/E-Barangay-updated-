import { useState } from 'react';
import { Header } from './AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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
  onNavigate: (view: 'dashboard' | 'services' | 'facilities' |  'application') => void;
  onSelectService: (service: string) => void;
}

const allServices = [
  {
    id: 1,
    title: 'Barangay Clearance',
    description: 'General clearance used for employment, school, IDs, and business applications.',
    category: 'permits',
    icon: FileCheck,
    processingTime: '1-2 days',
    fee: 'PHP 50',
    popularity: 5,
    availability: 'Business Hours',
    requirements: ['Valid ID', 'Accomplished request form', 'Cedula'],
    featured: true
  },
  {
    id: 2,
    title: 'Barangay Business Permit / Endorsement',
    description: 'Endorsement required before City Hall issues a business permit or for renewal.',
    category: 'business',
    icon: Building,
    processingTime: '2-3 days',
    fee: 'PHP 100',
    popularity: 4,
    availability: 'Business hours',
    requirements: ['Valid ID', 'Business documents'],
    featured: false
  },
  {
    id: 3,
    title: 'Barangay Building/Construction Endorsement',
    description: 'Endorsement certificate for building or construction permits.',
    category: 'permits',
    icon: Hammer,
    processingTime: '2-3 days',
    fee: 'PHP 100',
    popularity: 3,
    availability: 'Business hours',
    requirements: ['Building plan', 'Lot documents', 'Valid ID'],
    featured: false
  },
  {
    id: 4,
    title: 'Certificate of Residency',
    description: 'Proof of residency used for passports, travel, school enrollment, or other government services.',
    category: 'travel',
    icon: Home,
    processingTime: '1 day',
    fee: 'PHP 50',
    popularity: 5,
    availability: 'Business hours',
    requirements: ['Valid ID', 'Proof of Residence'],
    featured: true
  },
  {
    id: 5,
    title: 'Certificate of Indigency',
    description: 'Proof of indigency used for scholarships, medical or hospital assistance, legal aid, or social welfare programs.',
    category: 'social',
    icon: Users,
    processingTime: '1 day',
    fee: 'PHP 50',
    popularity: 5,
    availability: 'Business hours',
    requirements: ['Valid ID', 'Interview with Baranggay Staff'],
    featured: true
  },
  {
    id: 6,
    title: 'Barangay Health Certificate',
    description: 'Issued for food handlers, certain local jobs, or health-related requirements.',
    category: 'health',
    icon: HeartPulseIcon,
    processingTime: '1-2 days',
    fee: 'PHP 100',
    popularity: 4,
    availability: 'Business Hours',
    requirements: ['Medical check-up', 'Valid ID'],
    featured: false
  },
  {
    id: 7,
    title: 'Tricycle Operator’s Permit (TOP) Clearance',
    description: 'Barangay clearance needed before applying for a tricycle franchise.',
    category: 'transport',
    icon: Car,
    processingTime: '2 days',
    fee: 'PHP 150',
    popularity: 2,
    availability: 'Business hours',
    requirements: ['Valid ID', 'Franchise documents'],
    featured: true
  },
  {
    id: 8,
    title: 'Referral Slip to Health Center / Hospital',
    description: 'Barangay referral to access city health services or hospitals.',
    category: 'health',
    icon: Hospital,
    processingTime: 'Same day',
    fee: 'PHP 50',
    popularity: 2,
    availability: 'Business hours',
    requirements: ['Barangay assessment', 'Valid ID'],
    featured: false
  },
  {
    id: 9,
    title: 'Senior Citizen / PWD Certification Endorsement',
    description: 'Endorsement used to apply for senior or PWD IDs and government benefits.',
    category: 'social',
    icon: Accessibility,
    processingTime: '1-2 days',
    fee: 'PHP 50',
    popularity: 4,
    availability: 'Business hours',
    requirements: ['Valid ID', 'Medical proof (if PWD)'],
    featured: true
  },
  {
    id: 10,
    title: 'Solo Parent Certification Endorsement',
    description: 'Endorsement required for Solo Parent ID or benefits application.',
    category: 'social',
    icon: User,
    processingTime: '2 days',
    fee: 'PHP 50',
    popularity: 3,
    availability: 'Business hours',
    requirements: ['Valid ID', 'Proof of solo parent status'],
    featured: false
  },
  {
    id: 11,
    title: 'Barangay Blotter / Certification',
    description: 'Proof of a filed complaint or incident report at the barangay.',
    category: 'security',
    icon: Shield,
    processingTime: 'Same day',
    fee: 'PHP 50',
    popularity: 5,
    availability: '24/7',
    requirements: ['Incident details', 'Valid ID'],
    featured: false
  },
  {
    id: 12,
    title: 'Barangay Protection Order (BPO)',
    description: 'Protection order issued in cases of violence against women and children.',
    category: 'security',
    icon: Lock,
    processingTime: 'Same day',
    fee: 'PHP 0',
    popularity: 5,
    availability: '24/7',
    requirements: ['Complaint details', 'Police report (if available)'],
    featured: false
  }
];

const categories = [
  { id: 'all', label: 'All Services', count: allServices.length },
  { id: 'permits', label: 'Permits & Licenses', count: 2 },
  { id: 'travel', label: 'Travel & Immigration', count: 1 },
  { id: 'business', label: 'Business Services', count: 1 },
  { id: 'transport', label: 'Transport', count: 1 },
  { id: 'education', label: 'Education', count: 0 },
  { id: 'health', label: 'Health Services', count: 2 },
  { id: 'social', label: 'Social Services', count: 3 },
  { id: 'security', label: 'Security Services', count: 2 }
];

export function ServiceDirectory({ onNavigate, onSelectService }: ServiceDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');

  const filteredServices = allServices
    .filter(service => {
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return b.popularity - a.popularity;
        case 'alphabetical':
          return a.title.localeCompare(b.title);
        case 'processing':
          return a.processingTime.localeCompare(b.processingTime);
        default:
          return 0;
      }
    });

  const featuredServices = allServices.filter(service => service.featured);

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
                    const IconComponent = service.icon;
                    return (
                      <CarouselItem 
                        key={service.id} 
                        className="md:basis-1/2 lg:basis-1/3 px-2"
                      >
                        <Card 
                          className="border-2 border-blue-300 rounded-lg hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col"
                          onClick={() => onSelectService(service.title)}
                        >
                          <CardHeader className="pb-3 text-center">
                            <div className="flex justify-center">
                              <div>
                                <IconComponent className="h-7 w-7 bg-white text-blue-800 rounded-lg" />
                              </div>
                            </div>
                            <CardTitle className="text-lg mt-2">{service.title}</CardTitle>
                            <CardDescription className="text-sm">{service.description}</CardDescription>
                          </CardHeader>
                        
                          <CardContent className="pt-0 mt-auto">
                            <div className="flex items-center justify-between space-x-3">
                              {/* Processing Time Box */}
                              <div className="flex-1 flex items-center justify-center border-1 border-gray-400 rounded-md px-3 py-2 text-sm text-black">
                                <Clock className="h-4 w-4 mr-1" />
                                {service.processingTime}
                              </div>

                              {/* Fee Box */}
                              <div className="flex-1 flex items-center justify-center border-1 border-gray-400 rounded-md px-3 py-2 text-sm text-black">
                                {service.fee}
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
                    {categories.map((category) => (
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
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="alphabetical">A-Z</SelectItem>
                    <SelectItem value="processing">Processing Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          
            {/* SERVICES - Card */}
            <div className="space-y-4">
              {filteredServices.map((service) => {
                const IconComponent = service.icon;
                return (
                <Card
                  key={service.id}
                  className="hover:shadow-md transition-shadow cursor-pointer border-r-5 border-r-blue-700"
                  onClick={() => onSelectService(service.title)}
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
                          <h3 className="text-lg font-semibold mb-1">{service.title}</h3>

                          {/* Description */}
                          <p className="text-gray-600 mb-3">{service.description}</p>

                          {/* Badges + Processing inline */}
                          <div className="flex items-center space-x-3 mb-4">
                            <div className="flex items-center text-sm text-gray-700">
                              <Clock className="h-4 w-4 mr-1 text-gray-500" />
                              <span>{service.processingTime}</span>
                            </div>
                            {service.featured && (
                              <Badge className="bg-yellow-200 text-yellow-800 flex items-center">
                                <Star className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            )}
                            <Badge
                              variant={service.availability === "24/7" ? "default" : "secondary"}
                            >
                              {service.availability}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Right: Fee + Requirements stacked */}
                      <div className="flex flex-col space-y-2 text-sm text-gray-700 ml-6 w-40">
                        <div className="flex items-center justify-center border border-gray-300 rounded-md px-2 py-1 bg-white">
                          <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                          <span>Fee: {service.fee}</span>
                        </div>
                        <div className="flex items-center justify-center border border-gray-300 rounded-md px-2 py-1 bg-white">
                          <FileText className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{service.requirements.length} requirements</span>
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