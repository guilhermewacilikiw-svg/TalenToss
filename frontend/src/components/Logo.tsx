import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

export function Logo({ className = "", width = 160, height = 45 }: LogoProps) {
  return (
    <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
      <svg 
        viewBox="0 0 260 56" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Left T (Blue) - Stripe/Framer style cantos arredondados e offset */}
        <path 
          d="M 14 18 H 32" 
          stroke="#3B82F6" 
          strokeWidth="5.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M 23 18 V 38 C 23 40 25 42 27 42 H 38" 
          stroke="#3B82F6" 
          strokeWidth="5.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />
        
        {/* Right T (Green) */}
        <path 
          d="M 28 14 H 46" 
          stroke="#10B981" 
          strokeWidth="5.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M 37 14 V 30 C 37 32 39 34 41 34 H 52" 
          stroke="#10B981" 
          strokeWidth="5.5" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
        />

        {/* Text */}
        <text 
          x="68" 
          y="38" 
          fontFamily="system-ui, -apple-system, sans-serif" 
          fontSize="28" 
          fontWeight="800" 
          fill="#111827"
          letterSpacing="-0.03em"
        >
          TalenToss
        </text>
      </svg>
    </div>
  );
}
