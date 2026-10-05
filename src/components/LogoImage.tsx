
import React from 'react';

const LOGO_URL = '/brand/bee-app-bahamas-logo-v3.png';

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
      src={LOGO_URL} 
      alt="Bee App Bahamas"
      className={`object-contain ${sizeClasses[size]} ${className ?? ''}`}
      loading="eager"
      decoding="sync"
      fetchPriority="high"
      data-copyright-protected="true"
    />
  );
};

export default LogoImage;
