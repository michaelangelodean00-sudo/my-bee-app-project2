
import React from 'react';

interface LogoImageProps {
  className?: string;
  size?: 'default' | 'medium' | 'large' | 'xlarge' | 'xxlarge' | 'xxxlarge';
}

const LogoImage = ({ className, size = 'default' }: LogoImageProps) => {
  const sizeClasses = {
    default: 'h-20 w-auto max-h-20',
    medium: 'h-25 w-auto max-h-25',
    large: 'h-28 w-auto max-h-28',
    xlarge: 'h-32 w-auto max-h-32', 
    xxlarge: 'h-40 w-auto max-h-40',
    xxxlarge: 'h-48 w-auto max-h-48'
  };

  return (
    <img 
      src="/lovable-uploads/2893898e-72bd-4b44-96ae-dba8462fe68c.png" 
      alt="B.E.E App Bahamas Logo" 
      className={`object-contain ${sizeClasses[size]} ${className ?? ''}`}
    />
  );
};

export default LogoImage;
