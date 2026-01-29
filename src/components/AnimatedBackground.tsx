import { memo, useMemo } from "react";

// Generate particles once at module level to avoid re-computation
const generateParticles = () => 
  Array.from({ length: 6 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 15,
    size: 0.5 + Math.random() * 0.8,
    duration: 10 + Math.random() * 5
  }));

const staticParticles = generateParticles();

const AnimatedBackground = memo(() => {
  // Use static particles to avoid re-renders
  const particles = useMemo(() => staticParticles, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 contain-strict">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Gradient mask for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, transparent 0%, hsl(var(--background)) 70%)'
        }}
      />
      
      {/* Subtle gradient orbs - reduced complexity with will-change */}
      <div 
        className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-20 will-change-transform"
        style={{ 
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)',
          animation: 'float 20s ease-in-out infinite'
        }}
      />
      <div 
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full blur-3xl opacity-15 will-change-transform"
        style={{ 
          background: 'radial-gradient(circle, hsl(var(--accent) / 0.2) 0%, transparent 70%)',
          animation: 'float 25s ease-in-out infinite 3s'
        }}
      />
      
      {/* Floating circular particles - use CSS containment */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full will-change-transform"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}rem`,
            height: `${particle.size}rem`,
            background: 'hsl(var(--primary) / 0.06)',
            animation: `float ${particle.duration}s ease-in-out infinite ${particle.delay}s`,
            contain: 'layout style'
          }}
        />
      ))}
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;
