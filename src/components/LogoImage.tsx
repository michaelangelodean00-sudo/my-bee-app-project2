
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
    <img 
      src="/lovable-uploads/bee-mascot-logo.png" 
      alt="B.E.E App Bahamas Logo - © 2024 All Rights Reserved"
      className={`object-contain ${sizeClasses[size]} ${className ?? ''}`}
      data-copyright-protected="true"
    />
  );
};

export default LogoImage;
