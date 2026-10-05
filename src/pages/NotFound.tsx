
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logoAsset from "@/assets/bee-app-bahamas-logo.png.asset.json";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-4">
      <img 
        src={logoAsset.url} 
        alt="Bee App Bahamas" 
        className="h-24 w-auto mb-6"
      />
      <h1 className="heading-large mb-4">Page Not Found</h1>
      <p className="body-large text-muted-foreground mb-8 text-center">
        Oops! We couldn't find the page you're looking for.
      </p>
      <Button asChild variant="premium">
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  );
};

export default NotFound;
