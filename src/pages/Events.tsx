
import React from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { EventIcon, eventIconMap, iconBackgrounds } from "../components/icons/EventIcons";

const Events = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = React.useState(false);
  
  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  // Get all icon types (except image which we'll handle separately)
  const iconTypes = Object.keys(eventIconMap) as Array<keyof typeof eventIconMap>;
  
  // Get all background types
  const backgroundTypes = Object.keys(iconBackgrounds) as Array<keyof typeof iconBackgrounds>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header toggleMobileSidebar={toggleMobileSidebar} />
      
      <div className="flex">
        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={toggleMobileSidebar}
          />
        )}
        
        {/* Mobile Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out md:hidden`}>
          <Sidebar />
        </div>
        
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:block" />
        
        {/* Main Content */}
        <div className="flex-1 w-full max-w-5xl mx-auto py-6 px-4">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <h1 className="text-2xl font-bold mb-4">Event Icon Options</h1>
            <p className="text-gray-600 mb-6">
              Click on any icon to use it in your application. Each icon comes with multiple color options.
            </p>
            
            <h2 className="text-xl font-semibold mb-4">Lucide React Icons</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {iconTypes.map((iconType) => (
                <div key={iconType} className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
                  <EventIcon type={iconType} background="purple" className="mb-2" />
                  <span className="text-sm font-medium text-gray-700">{iconType}</span>
                </div>
              ))}
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Color Variants</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-8">
              {backgroundTypes.map((bgType) => (
                <div key={bgType} className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50">
                  <EventIcon type="creative" background={bgType} className="mb-2" />
                  <span className="text-sm font-medium text-gray-700">{bgType}</span>
                </div>
              ))}
            </div>
            
            <h2 className="text-xl font-semibold mb-4">Custom Image Icon</h2>
            <div className="flex flex-col items-center p-4 border rounded-lg hover:bg-gray-50 w-40 mx-auto">
              <EventIcon type="image" background="purple" className="mb-2" />
              <span className="text-sm font-medium text-gray-700">Custom Image</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Events;
