
import React from 'react';

interface LogoImageProps {
  className?: string;
  size?: 'default' | 'large' | 'xlarge' | 'xxlarge' | 'xxxlarge';
}

const LogoImage = ({ className, size = 'default' }: LogoImageProps) => {
  const sizeClasses = {
    default: 'h-24 w-auto max-h-24',
    large: 'h-32 w-auto max-h-32',
    xlarge: 'h-40 w-auto max-h-40', 
    xxlarge: 'h-48 w-auto max-h-48',
    xxxlarge: 'h-56 w-auto max-h-56'
  };

  return (
    <img 
      src="/lovable-uploads/new-bee-logo.png" 
      alt="B.E.E App Bahamas Logo - © 2024 All Rights Reserved" 
      className={`object-contain ${sizeClasses[size]} ${className ?? ''}`}
      data-copyright-protected="true"
    />
  );
};

export default LogoImage;
