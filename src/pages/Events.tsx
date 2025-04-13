
import React from 'react';
import { Dancing } from 'lucide-react';

const Events = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center space-y-6">
        <h1 className="text-3xl font-bold text-center">Discover Amazing Events</h1>
        
        <div className="w-full max-w-2xl">
          <img 
            src="https://images.unsplash.com/photo-1519671482749-fd09be7ccebf" 
            alt="People dancing" 
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
        
        <div className="text-center max-w-xl">
          <p className="text-lg text-gray-600">
            Get ready to move, groove, and make unforgettable memories at our exciting events!
          </p>
        </div>
        
        <div className="flex space-x-4">
          <button className="bg-bee-blue text-white px-6 py-2 rounded-md hover:bg-bee-darkblue transition-colors">
            Upcoming Events
          </button>
          <button className="bg-bee-yellow text-bee-black px-6 py-2 rounded-md hover:bg-opacity-90 transition-colors">
            Create Event
          </button>
        </div>
      </div>
    </div>
  );
};

export default Events;

