
import React from 'react';

interface LogoImageProps {
  className?: string;
}

const LogoImage = ({ className }: LogoImageProps) => {
  return (
    <img 
      src="/lovable-uploads/f4a4e8e5-574a-4d93-88f9-155b1f4b2e32.png" 
      alt="B.E.E App Bahamas Logo" 
      className={`h-28 sm:h-36 w-auto sm:w-96 max-h-36 object-contain ${className ?? ''}`}
    />
  );
};

export default LogoImage;
