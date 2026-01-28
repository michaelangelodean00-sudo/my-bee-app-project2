
import React from 'react';

interface LogoImageProps {
  className?: string;
  size?: 'default' | 'large' | 'xlarge' | 'xxlarge' | 'xxxlarge';
}

const LogoImage = ({ className, size = 'default' }: LogoImageProps) => {
  const sizeClasses = {
    default: 'h-20 sm:h-28 md:h-32 w-auto',
    large: 'h-28 sm:h-36 md:h-44 w-auto',
    xlarge: 'h-32 sm:h-44 md:h-52 w-auto', 
    xxlarge: 'h-40 sm:h-52 md:h-60 w-auto',
    xxxlarge: 'h-48 sm:h-60 md:h-72 w-auto'
  };

  return (
    <div className="relative inline-block">
      {/* Animated glow effect */}
      <div 
        className="absolute inset-0 rounded-full bg-amber-400/40 blur-2xl animate-pulse scale-75 -z-10"
        style={{ 
          animation: 'glow-pulse 3s ease-in-out infinite',
        }}
      />
      <div 
        className="absolute inset-0 rounded-full bg-amber-500/20 blur-3xl scale-110 -z-20"
        style={{ 
          animation: 'glow-pulse 4s ease-in-out infinite reverse',
        }}
      />
      <img 
        src="/lovable-uploads/bee-mascot-logo.png" 
        alt="B.E.E App Bahamas Logo - © 2024 All Rights Reserved"
        className={`object-contain ${sizeClasses[size]} ${className ?? ''} relative z-10`}
        data-copyright-protected="true"
      />
      <style>{`
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.4; transform: scale(0.75); }
          50% { opacity: 0.7; transform: scale(0.9); }
        }
      `}</style>
    </div>
  );
};

export default LogoImage;
