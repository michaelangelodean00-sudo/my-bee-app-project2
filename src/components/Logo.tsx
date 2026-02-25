import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import LogoImage from "./LogoImage";

interface LogoProps {
  className?: string;
}

const Logo = ({ className }: LogoProps) => {
  const [isPressed, setIsPressed] = useState(false);

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
      {/* Sun & Cloud above logo */}
      <div className="relative flex items-end justify-center w-full mb-[-8px] h-7 select-none pointer-events-none">
        {/* Sun */}
        <span
          className="absolute text-xl"
          style={{
            left: '50%',
            transform: 'translateX(-68px)',
            bottom: 0,
            animation: 'sunFloat 3s ease-in-out infinite',
            filter: 'drop-shadow(0 0 6px rgba(255, 200, 0, 0.7))',
          }}
        >
          ☀️
        </span>
        {/* Cloud */}
        <span
          className="absolute text-2xl"
          style={{
            left: '50%',
            transform: 'translateX(-10px)',
            bottom: 0,
            animation: 'cloudFloat 4s ease-in-out infinite',
          }}
        >
          ⛅
        </span>
        <style>{`
          @keyframes sunFloat {
            0%, 100% { transform: translateX(-68px) translateY(0px); }
            50% { transform: translateX(-68px) translateY(-4px); }
          }
          @keyframes cloudFloat {
            0%, 100% { transform: translateX(-10px) translateY(0px); }
            50% { transform: translateX(-10px) translateY(-5px); }
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
