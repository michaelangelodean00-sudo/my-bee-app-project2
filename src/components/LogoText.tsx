
import React from 'react';

interface LogoTextProps {
  className?: string;
}

const LogoText = ({ className }: LogoTextProps) => {
  return (
    <span className={`font-bold text-bee-blue inline sm:hidden font-bebas-neue ${className ?? 'text-4xl sm:text-5xl md:text-6xl'}`}>
      B.E.E App
    </span>
  );
};

export default LogoText;
