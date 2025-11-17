'use client'

import { Header } from './AdminHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Label } from "../ui/label"
import Footer from "../Footer";
import { useCategories, useItems } from '@/lib/hooks/useItems';
import { getStatistics } from '@/lib/api/statistics';
import { useEffect, useState } from 'react';

import { 
  Plane, 
  GraduationCap, 
  Heart, 
  Building, 
  Car,
  Users,
  Shield,
  ArrowRight,
  TrendingUp,
  Star,
  Volleyball,
  ShoppingBasket,
  Landmark,
  Warehouse,
  FileCheck2,
  Clock
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface MainDashboardProps {
  onNavigate: (view: 'dashboard' | 'directory' | 'requests') => void;
  onSelectService?: (service: string) => void;
}

export function MainDashboard({ onNavigate, onSelectService }: MainDashboardProps) {
  const { categories, loading: categoriesLoading } = useCategories()
  const { items: services } = useItems('service')
  const { items: facilities } = useItems('facility')
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    async function loadStats() {
      try {
        const statistics = await getStatistics()
        setStats(statistics)
      } catch (error) {
        console.error('Failed to load statistics:', error)
      }
    }
    loadStats()
  }, [])

  // Filter categories for services and facilities
  const serviceCategories = categories
    .filter(cat => services.some(s => s.category_id === cat.id))
    .map((cat, index) => {
      const count = services.filter(s => s.category_id === cat.id).length
      const nameLower = cat.name?.toLowerCase() || ''
      const iconKey = Object.keys(categoryIconMap).find(key => nameLower.includes(key)) || 'default'
      const IconComponent = categoryIconMap[iconKey]
      const color = colorClasses[index % colorClasses.length]
      
      return {
        id: cat.id,
        title: cat.name || 'Category',
        description: cat.description || '',
        icon: IconComponent,
        count,
        color,
        popular: count >= 3
      }
    })

  const facilityReservation = categories
    .filter(cat => facilities.some(f => f.category_id === cat.id))
    .map((cat, index) => {
      const count = facilities.filter(f => f.category_id === cat.id).length
      const nameLower = cat.name?.toLowerCase() || ''
      const iconKey = Object.keys(facilityIconMap).find(key => nameLower.includes(key)) || 'default'
      const IconComponent = facilityIconMap[iconKey]
      const color = colorClasses[index % colorClasses.length]
      
      return {
        id: cat.id,
        title: cat.name || 'Facility',
        description: cat.description || '',
        icon: IconComponent,
        count,
        color,
        popular: count >= 2
      }
    })

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

interface Faq1Props {
  heading?: string;
  items?: FaqItem[];
}

// Icon mapping for categories
const categoryIconMap: Record<string, any> = {
  'education': GraduationCap,
  'travel': Plane,
  'health': Heart,
  'business': Building,
  'transport': Car,
  'social': Users,
  'security': Shield,
  'default': FileCheck2,
}

const facilityIconMap: Record<string, any> = {
  'basketball': ShoppingBasket,
  'court': Volleyball,
  'hall': Landmark,
  'function': Warehouse,
  'default': Landmark,
}

// Color mapping
const colorClasses = [
  'bg-purple-100 text-purple-600',
  'bg-green-100 text-green-600',
  'bg-red-100 text-red-600',
  'bg-orange-100 text-orange-600',
  'bg-indigo-100 text-indigo-600',
  'bg-pink-100 text-pink-600',
  'bg-gray-100 text-gray-600',
  'bg-blue-100 text-blue-800',
]

const recentUpdates = [
  {
    title: 'New Support Contact Added',
    date: '2025-10-05',
    type: 'Enhancement'
  },
  {
    title: 'Community Hall Reservation Launched',
    date: '2025-10-11',
    type: 'Enhancement'
  },
  {
    title: 'Maintenance Notice',
    date: '2025-11-21',
    type: 'Update'
  }
];

const Faq1 = ({
  items = [
    {
      id: "faq-1",
      question: "What is E-Barangay?",
      answer:
        "E-Barangay is an online portal where residents can easily request barangay services, apply for permits, and reserve local facilities — all in one place.",
    },
    {
      id: "faq-2",
      question: "How do I request a barangay service?",
      answer:
        "Go to the Services page, browse the list of available services, and click Apply. Fill out the required form and wait for confirmation from barangay staff.",
    },
    {
      id: "faq-3",
      question: "How do I reserve a facility?",
      answer:
        "Navigate to the Facilities section, choose your preferred facility (e.g., basketball court, hall, or covered court), then select your date and submit your reservation request.",
    },
    {
      id: "faq-4",
      question: "How can I check the status of my application or reservation?",
      answer:
        "After logging in, open your Dashboard. There you’ll see your submitted requests and their current status (Pending, Approved, or Rejected).",
    },
    {
      id: "faq-5",
      question: "Is there a fee for submitting service requests or reservations?",
      answer:
        "Some services or facility reservations may have fees. You can view the fees beside each service or facility before applying.",
    }
  ],
}: Faq1Props) => {
  return (
    <section className="py-5">
      <div>
        <Accordion type="single" collapsible>
          {items.map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-200 p-6 rounded-lg m-5">
        <Header onNavigate={onNavigate}/>

        <main className="max-w-7xl mx-auto px-4 py-8">
          
          {/* Hero Section */}
          <div className="items-center pd-10 md:p-10 text-center">
            <Badge variant="outline" className="text-xs mb-3">Barangay IV</Badge>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome, Admin!
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              Manage your barangay's services and facilities with ease. <br />
              Add, remove, or review user requests anytime.
            </p>

            <div className="mt-6 flex justify-center gap-4">
              <button
                onClick={() =>
                  document.getElementById("permits")?.scrollIntoView({ behavior: "smooth" })
                }
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Get started
              </button>
            </div>
          </div>

          <div id="permits" className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Service Categories */}
              <div className="mb-8 bg-blue-200 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl">Permits & Licenses</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => onNavigate('services')}
                  >
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {serviceCategories.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Card 
                        key={category.id} 
                        className="hover:shadow-lg transition-shadow cursor-pointer relative"
                        onClick={() => onNavigate('services')}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-lg ${category.color}`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <Badge variant="secondary">{category.count} services</Badge>
                              {category.popular && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <Star className="h-3 w-3 mr-1" />
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </div>
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                          <CardDescription>{category.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Facility Reservation */}
              <div className="mb-8 bg-blue-200 p-6 rounded-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl">Facilities Reservation</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => onNavigate('facilities')}
                  >
                    View All
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {facilityReservation.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <Card 
                        key={category.id} 
                        className="hover:shadow-lg transition-shadow cursor-pointer relative"
                        onClick={() => onNavigate('facilities')}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between">
                            <div className={`p-3 rounded-lg ${category.color}`}>
                              <IconComponent className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <Badge variant="secondary">{category.count} facility</Badge>
                              {category.popular && (
                                <Badge className="bg-yellow-100 text-yellow-800">
                                  <Star className="h-3 w-3 mr-1" />
                                  Popular
                                </Badge>
                              )}
                            </div>
                          </div>
                          <CardTitle className="text-lg">{category.title}</CardTitle>
                          <CardDescription>{category.description}</CardDescription>
                        </CardHeader>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Announcements */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center font-semibold">
                    <Clock className="h-5 w-5 mr-2" />
                    Recent Updates
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentUpdates.map((update, index) => (
                    <div key={index} className="border-l-2 border-blue-200 pl-4">
                      <h4 className="font-medium text-sm">{update.title}</h4>
                      <div className="flex items-center justify-between mt-1">
                        <Badge variant="outline" className="text-xs">{update.type}</Badge>
                        <span className="text-xs text-gray-500">{update.date}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center font-semibold">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Service Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Services</span>
                    <span className="font-semibold">{stats?.totalServices || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Facilities</span>
                    <span className="font-semibold">{stats?.totalFacilities || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Total Requests</span>
                    <span className="font-semibold">{stats?.totalRequests || 0}</span>
                  </div>
                </CardContent>
              </Card>
              
              {/* Frequently Asked Questions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-3xl font-semibold text-3xl">Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Your guide to getting started with E-Barangay's digital services.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Faq1 />
                </CardContent>
              </Card>

              {/* Help & Support */}
              <Card>
                <CardHeader>
                  <CardTitle className='font-semibold'>Need Help?</CardTitle>
                  <CardDescription>
                    Get assistance with government services
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">📞 Contact Support</Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">

                      <div className="grid gap-4">
                        <div className="grid gap-3">
                          <Label htmlFor="name-1">Bacoor Cavite Customer Service</Label>
                          <Button type="submit" className="bg-blue-500 hover:bg-blue-400 text-white">📞 +639477240991 </Button>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor="username-1">Bacoor Cavite Hotline</Label>
                          <Button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-white">📞 +639813649935 </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => alert('Opening live chat...')}
                  >
                    💬 Live Chat
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => alert('Downloading user guide...')}
                  >
                    📚 User Guide
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>   
      <div> <Footer /> </div> 
    </div>
  );
}