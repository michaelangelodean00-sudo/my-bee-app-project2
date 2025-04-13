
import React from 'react';

interface LogoImageProps {
  className?: string;
}

const LogoImage = ({ className }: LogoImageProps) => {
  return (
    <img 
      src="/lovable-uploads/f4a4e8e5-574a-4d93-88f9-155b1f4b2e32.png" 
      alt="B.E.E App Bahamas Logo" 
      className={`h-32 sm:h-40 w-auto sm:w-[120px] max-h-40 object-contain ${className ?? ''}`}
    />
  );
};

export default LogoImage;
