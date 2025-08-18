import { Button } from "./ui/button";
import { ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 bg-gradient-elegant opacity-90" />
      <div className="absolute inset-0 bg-pattern-bee-subtle opacity-20" />
      
      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/20 rounded-full blur-xl animate-float" />
      <div className="absolute top-32 right-16 w-16 h-16 bg-accent/30 rounded-full blur-lg animate-float" style={{animationDelay: '1s'}} />
      <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-secondary/25 rounded-full blur-md animate-float" style={{animationDelay: '2s'}} />
      
      {/* Main hero content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full text-sm font-medium animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Welcome to B.E.E Community
            </span>
          </div>
          
          {/* Main heading */}
          <div className="space-y-4 animate-stagger-fade">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight">
              <span className="bg-gradient-hero bg-clip-text text-transparent">
                Connect, Create,
              </span>
              <br />
              <span className="bg-gradient-secondary bg-clip-text text-transparent">
                Collaborate
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Join the most vibrant community for businesses, events, and e-commerce. 
              Share your story, discover opportunities, and grow together.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in" style={{animationDelay: '0.3s'}}>
            <Button size="lg" className="group glass-button-premium">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button variant="outline" size="lg" className="glass-button">
              Explore Community
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 animate-fade-in" style={{animationDelay: '0.5s'}}>
            <div className="glass-card p-6 group hover:glass-card-hover transition-all duration-300">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">10K+</span>
              </div>
              <p className="text-sm text-muted-foreground">Active Members</p>
            </div>
            
            <div className="glass-card p-6 group hover:glass-card-hover transition-all duration-300">
              <div className="flex items-center justify-center gap-3 mb-2">
                <TrendingUp className="w-5 h-5 text-accent" />
                <span className="text-2xl font-bold text-foreground">50K+</span>
              </div>
              <p className="text-sm text-muted-foreground">Posts Shared</p>
            </div>
            
            <div className="glass-card p-6 group hover:glass-card-hover transition-all duration-300">
              <div className="flex items-center justify-center gap-3 mb-2">
                <Sparkles className="w-5 h-5 text-secondary" />
                <span className="text-2xl font-bold text-foreground">100+</span>
              </div>
              <p className="text-sm text-muted-foreground">Success Stories</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;