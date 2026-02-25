import { useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import LogoImage from "./LogoImage";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  const [isPressed, setIsPressed] = useState(false);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString("en-US", {
        timeZone: "America/New_York",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setClock(timeStr);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTap = useCallback(() => {
    // Haptic feedback on tap
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  }, []);

  return (
    <Link 
      to="/" 
      className={`flex flex-col items-center ${className ?? ''}`}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      onClick={handleTap}
    >
      {/* Sun (far left) + EST Digital Clock */}
      <div className="flex items-center gap-1 w-full mb-1 select-none pointer-events-none">
        <span
          style={{
            fontSize: '1.1rem',
            animation: 'sunFloat 3s ease-in-out infinite',
            filter: 'drop-shadow(0 0 5px rgba(255, 200, 0, 0.7))',
            display: 'inline-block',
          }}
        >
          ☀️
        </span>
        <span
          style={{
            fontSize: '0.6rem',
            fontVariantNumeric: 'tabular-nums',
            letterSpacing: '0.04em',
            color: 'hsl(var(--muted-foreground))',
            fontFamily: 'monospace',
          }}
        >
          {clock} EST
        </span>
        <style>{`
          @keyframes sunFloat {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
          }
        `}</style>
      </div>

      <div 
        className={`transition-transform duration-150 ease-out ${
          isPressed ? 'scale-90' : 'scale-100 hover:scale-105'
        }`}
      >
        <LogoImage size="large" />
      </div>
    </Link>
  );
};

export default Logo;
