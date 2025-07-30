import { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LogoImage from './LogoImage';

const HeroSection = () => {
  const [currentFeature, setCurrentFeature] = useState(0);
  
  const features = [
    { icon: Users, text: "Connect with Local Businesses" },
    { icon: TrendingUp, text: "Discover Amazing Events" },
    { icon: Sparkles, text: "Shop Exclusive Products" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [features.length]);

  return (
    <section className="relative hero-gradient py-16 lg:py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl floating-animation"></div>
        <div className="absolute top-32 right-20 w-32 h-32 bg-secondary/20 rounded-full blur-xl floating-animation" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-primary/20 rounded-full blur-xl floating-animation" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                <span className="font-bebas gradient-text">
                  WELCOME TO B.E.E
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
                Bahamas Business Economic Exchange - Your gateway to connecting, growing, and thriving in the Bahamas business ecosystem.
              </p>
            </div>

            {/* Animated feature showcase */}
            <div className="flex items-center justify-center lg:justify-start space-x-3 h-12">
              <div className="flex items-center space-x-2 text-lg font-medium">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 transition-all duration-500 ${
                        index === currentFeature 
                          ? 'opacity-100 scale-100' 
                          : 'opacity-50 scale-95'
                      }`}
                    >
                      <Icon className="w-6 h-6 text-primary" />
                      <span className={index === currentFeature ? 'text-primary' : 'text-muted-foreground'}>
                        {feature.text}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="bee-btn group"
              >
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="glass-card border-2 hover:bg-primary/10"
              >
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/20">
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary">1000+</div>
                <div className="text-sm text-muted-foreground">Businesses</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-secondary">500+</div>
                <div className="text-sm text-muted-foreground">Events</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-2xl md:text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Members</div>
              </div>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative">
            <div className="relative glass-card p-8 lg:p-12">
              <div className="absolute inset-0 hero-gradient rounded-2xl"></div>
              <div className="relative z-10 text-center">
                <div className="floating-animation mb-6">
                  <LogoImage size="xxxlarge" className="mx-auto drop-shadow-2xl" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Join the <span className="gradient-text">B.E.E Community</span>
                </h3>
                <p className="text-muted-foreground mb-6">
                  Connect with entrepreneurs, discover opportunities, and grow your business in paradise.
                </p>
                <div className="flex justify-center space-x-4">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;