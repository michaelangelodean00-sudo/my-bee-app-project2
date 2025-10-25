
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <img 
        src="/lovable-uploads/new-bee-logo.png" 
        alt="B.E.E App Bahamas Logo" 
        className="h-24 mb-6"
      />
      <h1 className="text-4xl font-bold mb-4 text-bee-black">Page Not Found</h1>
      <p className="text-xl text-gray-600 mb-8 text-center">
        Oops! We couldn't find the page you're looking for.
      </p>
      <Button asChild className="bg-bee-yellow text-bee-black hover:bg-bee-yellow/90">
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
