
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const eventsData = [
  {
    id: "event1",
    title: "Junkanoo Festival",
    date: "December 26, 2025",
    time: "2:00 AM - 10:00 AM",
    location: "Bay Street, Nassau",
    attendees: 1250,
    type: "Cultural",
    image: "https://images.unsplash.com/photo-1541535881962-3bb380b08458?q=80&w=1000",
    description: "Experience the vibrant colors and rhythmic music of Bahamas' most celebrated cultural festival."
  },
  {
    id: "event2",
    title: "Island Food & Wine Festival",
    date: "October 15, 2025",
    time: "12:00 PM - 8:00 PM",
    location: "Arawak Cay, Nassau",
    attendees: 850,
    type: "Food & Drink",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1000",
    description: "Sample local cuisine and international wines at this annual culinary celebration."
  },
  {
    id: "event3",
    title: "Bahamas International Film Festival",
    date: "November 5-12, 2025",
    time: "Various Times",
    location: "Multiple Venues, Nassau",
    attendees: 620,
    type: "Entertainment",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000",
    description: "Discover independent films from around the world at this acclaimed film festival."
  },
  {
    id: "event4",
    title: "Regatta Weekend",
    date: "September 3-5, 2025",
    time: "9:00 AM - 6:00 PM",
    location: "Montagu Bay, Nassau",
    attendees: 1500,
    type: "Sports",
    image: "https://images.unsplash.com/photo-1534008897995-27a23e859048?q=80&w=1000",
    description: "Witness traditional Bahamian sloop sailing and enjoy beach activities during this nautical event."
  }
];

const Events = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleMobileSidebar={() => {}} />
      
      <div className="flex">
        <Sidebar className="hidden md:block" />
        
        {/* Main Content */}
        <div className="flex-1 max-w-4xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6 text-bee-black">Upcoming Events</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {eventsData.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={event.image} 
                    alt={event.title} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-bee-yellow text-bee-black hover:bg-bee-yellow/90">
                      {event.type}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-sm text-gray-600">{event.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-gray-500" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-gray-500" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-gray-500" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={16} className="text-gray-500" />
                      <span>{event.attendees} attending</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button className="w-full bg-bee-blue hover:bg-bee-blue/90">RSVP Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
