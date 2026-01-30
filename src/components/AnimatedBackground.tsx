import { memo, useMemo } from "react";

// Generate particles once at module level to avoid re-computation
const staticParticles = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  x: 20 + (i * 20),
  y: 20 + (i * 15),
  size: 0.4 + (i * 0.15),
  duration: 15 + (i * 3)
}));

const AnimatedBackground = memo(() => {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" style={{ contain: 'strict' }}>
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      {/* Gradient mask for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 0%, transparent 0%, hsl(var(--background)) 70%)'
        }}
      />
      
      {/* Single gradient orb - reduced from 2 */}
      <div 
        className="absolute top-20 left-10 w-96 h-96 rounded-full blur-3xl opacity-15"
        style={{ 
          background: 'radial-gradient(circle, hsl(var(--primary) / 0.12) 0%, transparent 70%)',
          animation: 'float 25s ease-in-out infinite'
        }}
      />
      
      {/* Minimal floating particles - reduced count */}
      {staticParticles.map((particle) => (
        <div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}rem`,
            height: `${particle.size}rem`,
            background: 'hsl(var(--primary) / 0.04)',
            animation: `float ${particle.duration}s ease-in-out infinite`,
            contain: 'layout style'
          }}
        />
      ))}
    </div>
  );
});

AnimatedBackground.displayName = 'AnimatedBackground';

export default AnimatedBackground;
