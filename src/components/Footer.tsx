import { Link } from "react-router-dom";
import { Calendar, Shield, Heart } from "lucide-react";
import Logo from "./Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-background to-muted/50 border-t border-border/50 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Main Footer Content */}

        {/* Copyright Bar */}
        <div className="border-t border-border/50 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-col items-center md:items-start gap-2">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                © {currentYear} B.E.E App Bahamas. All rights reserved.
              </p>
              <p className="text-xs text-muted-foreground text-center md:text-left">
                Trademark and copyright protected. Unauthorized reproduction is strictly prohibited.
              </p>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Made with</span>
              <Heart size={12} className="text-red-500 animate-pulse" />
              <span>in The Bahamas</span>
              <Calendar size={12} />
              <span>{currentYear}</span>
            </div>
          </div>

          {/* Additional Copyright Notice */}
          <div className="mt-4 text-xs text-muted-foreground/70 text-center">
            <p>
              The B.E.E App logo, name, design, and all content are protected by copyright laws. 
              This application and its contents are proprietary and confidential information.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;