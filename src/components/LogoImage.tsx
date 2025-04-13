
import React from 'react';

interface LogoImageProps {
  className?: string;
  size?: 'default' | 'large' | 'xlarge';
}

const LogoImage = ({ className, size = 'default' }: LogoImageProps) => {
  const sizeClasses = {
    default: 'h-20 sm:h-25 w-auto sm:w-48 max-h-25',
    large: 'h-32 sm:h-40 w-auto sm:w-64 max-h-40',
    xlarge: 'h-48 sm:h-56 w-auto sm:w-80 max-h-56'
  };

  return (
    <img 
      src="/lovable-uploads/f4a4e8e5-574a-4d93-88f9-155b1f4b2e32.png" 
      alt="B.E.E App Bahamas Logo" 
      className={`object-contain ${sizeClasses[size]} ${className ?? ''}`}
    />
  );
};

export default LogoImage;
