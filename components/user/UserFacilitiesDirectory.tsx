import { useState } from 'react';
import { Header } from './UserHeader';
import { Input } from '../ui/input';
import { Search, Clock } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconShadowUrl from "leaflet/dist/images/marker-shadow.png";
import Footer from "../Footer";

interface FacilityDirectoryProps {
  onNavigate: (view: 'dashboard' | 'services' | 'facilities' |  'application') => void;
  onSelectFacility: (facility: string) => void;
}

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const facilities = [
  { name: "Barangay Gynmnasium", lat: 14.4140, lng: 120.9705 },
  { name: "Barangay Multipurpose Hall", lat: 14.3540, lng: 120.9419 },
  { name: "Solviento Villas Bacoor Cavite", lat: 14.41, lng: 120.97 },
];

const allFacilities = [
  {
    id: 1,
    title: 'Barangay Covered Court',
    address: 'General CXJ9+M57, Bacoor Blvd, Bacoor, Cavite, Philippines.',
    category: 'covered-court',
    image: '/images/Covered-court.jpeg',
    processingTime: '1-2 days',
    fee: 'PHP 100',
    requirements: ['Valid ID', 'Accomplished request form', 'Cedula']
  },
  {
    id: 2,
    title: 'Barangay Basketball Court',
    address: 'General CXJ9+M57, Bacoor Blvd, Bacoor, Cavite, Philippines.',
    category: 'basketball-court',
    image: '/images/Basketball-court.jpg',
    processingTime: '1 day',
    fee: 'PHP 100',
    requirements: ['Valid ID', 'Accomplished request form', 'Cedula']
  },
  {
    id: 3,
    title: 'Barangay Multipurpose Hall',
    address: 'General CXJ9+M57, Bacoor Blvd, Bacoor, Cavite, Philippines.',
    category: 'multipurpose-hall',
    image: '/images/Multipurpose-hall.jpg',
    processingTime: '2-5 days',
    fee: 'PHP 100',
    requirements: ['Valid ID', 'Accomplished request form', 'Cedula']
  },
  {
    id: 4,
    title: 'Barangay Function Room',
    address: 'General CXJ9+M57, Bacoor Blvd, Bacoor, Cavite, Philippines.',
    category: 'function-room',
    image: '/images/Function-room.jpg',
    processingTime: '3 days',
    fee: 'PHP 100',
    requirements: ['Valid ID', 'Accomplished request form', 'Cedula']
  }
];

const categories = [
  { id: 'all', label: 'All Facilities', count: allFacilities.length },
  { id: 'covered-court', label: 'Covered Court', count: 2 },
  { id: 'basketball-court', label: 'Basketball Court', count: 1 },
  { id: 'multipurpose-hall', label: 'Multipurpose Hall', count: 1 },
  { id: 'function-room', label: 'Function Room', count: 1 }
];

export function FacilitiesDirectory({ onNavigate, onSelectFacility }: FacilityDirectoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredServices = allFacilities
    .filter(facility => {
      const matchesSearch = facility.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           facility.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || facility.category === selectedCategory;
      return matchesSearch && matchesCategory
    });

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-gray-200 p-6 rounded-lg m-5">
        <Header onNavigate={onNavigate} />

        <main className="max-w-7xl mx-auto px-4 py-8">

          {/* MAP VIEW */}
          <h2 className="text-2xl mb-4 flex items-center font-semibold justify-center"> Barangay Facilities</h2>
          <div className="w-[75%] mx-auto h-[300px] rounded-2xl overflow-hidden shadow-xl mb-8 border-1 border-blue-600">
            <MapContainer
              center={[14.41, 120.97]}
              zoom={12}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='© OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {facilities.map((facility, idx) => (
                <Marker key={idx} position={[facility.lat, facility.lng]}>
                  <Popup>{facility.name}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>


          {/* FACILITIES - Search Box */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">All Facilities ({filteredServices.length})</h2>
            </div>
            {/* Search + Category */}
            <div className="flex items-center gap-4 mb-6">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search facilities..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-full bg-white"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="w-150">
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
            </div>
          </div>

          {/* FACILITIES - Card */}
          <div className="space-y-4 grid md:grid-cols-3 gap-4">
            {filteredServices.map((facilities) => {
              return (
              <div className='w-full max-w-4xl'>
                <Card 
                  className="rounded-lg hover:shadow-lg transition-shadow cursor-pointer max-h-120px flex flex-col"
                  onClick={() => onSelectFacility(facilities.title)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start gap-4">
                      {/* Image on the left */}
                      <img
                        src={facilities.image}
                        alt={facilities.title}
                        className="w-48 h-36 object-cover rounded-lg border border-blue-800"
                      />

                      {/* Text content beside the image */}
                      <div className="flex flex-col justify-center text-left">
                        <CardTitle className="text-lg font-bold mb-1">{facilities.title}</CardTitle>
                        <CardDescription className="text-sm text-gray-600">
                          {facilities.address}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-2">
                    <div className="flex items-center justify-between space-x-3">
                      {/* Processing Time Box */}
                      <div className="flex-1 flex items-center justify-center border border-gray-400 rounded-md px-3 py-2 text-sm text-black">
                        <Clock className="h-4 w-4 mr-1" />
                        {facilities.processingTime}
                      </div>

                      {/* Fee Box */}
                      <div className="flex-1 flex items-center justify-center border border-gray-400 rounded-md px-3 py-2 text-sm text-black">
                        {facilities.fee}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              );
            })}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No services found</div>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}

        </main>
      </div>
      <div> <Footer /> </div> 
    </div>
  );
}