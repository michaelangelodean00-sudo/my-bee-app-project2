
import React from 'react';

interface LogoImageProps {
  className?: string;
  size?: 'default' | 'large' | 'xlarge';
}

const LogoImage = ({ className, size = 'default' }: LogoImageProps) => {
  const sizeClasses = {
    default: 'h-10 w-auto max-h-10',
    large: 'h-20 w-auto max-h-20',
    xlarge: 'h-32 w-auto max-h-32'
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
