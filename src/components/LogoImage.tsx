
import React from 'react';

interface LogoImageProps {
  className?: string;
  size?: 'default' | 'large' | 'xlarge' | 'xxlarge' | 'xxxlarge';
}

const LogoImage = ({ className, size = 'default' }: LogoImageProps) => {
  const sizeClasses = {
    default: 'h-16 sm:h-20 md:h-24 w-auto',
    large: 'h-20 sm:h-28 md:h-32 w-auto',
    xlarge: 'h-24 sm:h-32 md:h-40 w-auto', 
    xxlarge: 'h-32 sm:h-40 md:h-48 w-auto',
    xxxlarge: 'h-40 sm:h-48 md:h-56 w-auto'
  };

  return (
    <img 
      src="/lovable-uploads/bee-mascot-logo.png" 
      alt="B.E.E App Bahamas Logo - © 2024 All Rights Reserved"
      className={`object-contain ${sizeClasses[size]} ${className ?? ''}`}
      data-copyright-protected="true"
    />
  );
};

export default LogoImage;
