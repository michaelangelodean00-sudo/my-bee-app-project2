
import React from 'react';

interface LogoImageProps {
  className?: string;
  size?: 'default' | 'large' | 'xlarge' | 'xxlarge' | 'xxxlarge';
}

const LogoImage = ({ className, size = 'default' }: LogoImageProps) => {
  const sizeClasses = {
    default: 'h-24 sm:h-32 md:h-40 w-auto',
    large: 'h-32 sm:h-44 md:h-52 w-auto',
    xlarge: 'h-40 sm:h-52 md:h-60 w-auto', 
    xxlarge: 'h-48 sm:h-60 md:h-72 w-auto',
    xxxlarge: 'h-56 sm:h-72 md:h-80 w-auto'
  };

  return (
    <img 
      src="/lovable-uploads/bee-mascot-logo.png" 
      alt="B.E.E App Bahamas Logo - © 2024 All Rights Reserved"
      className={`object-contain ${sizeClasses[size]} ${className ?? ''}`}
      loading="eager"
      decoding="async"
      data-copyright-protected="true"
    />
  );
};

export default LogoImage;
