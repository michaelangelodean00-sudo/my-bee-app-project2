import { useEffect, useState } from "react";

const AnimatedBackground = () => {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; delay: number; size: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 15,
      size: 0.5 + Math.random() * 1
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Honeycomb pattern overlay */}
      <div className="absolute inset-0 pattern-honeycomb-lg pattern-honeycomb-animated opacity-60" />
      
      {/* Gradient mask for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, transparent 0%, hsl(var(--background)) 70%)'
        }}
      />
      
      {/* Subtle gradient orbs - warm honey tones */}
      <div 
        className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl animate-float opacity-25"
        style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.2) 0%, transparent 70%)' }}
      />
      <div 
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl animate-float opacity-20"
        style={{ 
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.25) 0%, transparent 70%)',
          animationDelay: '3s' 
        }}
      />
      <div 
        className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full blur-3xl animate-float opacity-15"
        style={{ 
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
          animationDelay: '6s' 
        }}
      />
      
      {/* Hexagonal floating particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-float"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size * 1.2}rem`,
            height: `${particle.size * 1.2}rem`,
            background: 'hsl(var(--primary) / 0.1)',
            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
            animationDelay: `${particle.delay}s`,
            animationDuration: `${8 + Math.random() * 4}s`
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
