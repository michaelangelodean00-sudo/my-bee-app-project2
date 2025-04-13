
import React from 'react';

interface LogoTextProps {
  className?: string;
}

const LogoText = ({ className }: LogoTextProps) => {
  return (
    <span className={`text-3xl sm:text-4xl font-bold text-bee-blue hidden sm:inline font-bebas-neue ${className ?? ''}`}>
      B.E.E App
    </span>
  );
};

export default LogoText;
