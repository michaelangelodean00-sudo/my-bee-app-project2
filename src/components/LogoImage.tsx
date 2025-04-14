
import React from 'react';

interface LogoImageProps {
  className?: string;
  size?: 'default' | 'large' | 'xlarge' | 'xxlarge' | 'xxxlarge';
}

const LogoImage = ({ className, size = 'default' }: LogoImageProps) => {
  const sizeClasses = {
    default: 'h-20 w-auto max-h-20',
    large: 'h-28 w-auto max-h-28',
    xlarge: 'h-32 w-auto max-h-32',
    xxlarge: 'h-40 w-auto max-h-40',
    xxxlarge: 'h-48 w-auto max-h-48'
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
