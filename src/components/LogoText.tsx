
import React from 'react';

interface LogoTextProps {
  className?: string;
}

const LogoText = ({ className }: LogoTextProps) => {
  return (
    <span className={`text-5xl sm:text-6xl md:text-7xl font-bold text-bee-blue hidden sm:inline font-bebas-neue ${className ?? ''}`}>
      B.E.E App
    </span>
  );
};

export default LogoText;
