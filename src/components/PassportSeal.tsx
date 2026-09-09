import React from 'react';

interface PassportSealProps {
  size?: number; // e.g. 56 or 80
  variant?: 'navy' | 'gold' | 'cream';
  className?: string;
}

export const PassportSeal: React.FC<PassportSealProps> = ({
  size = 56,
  variant = 'gold',
  className = '',
}) => {
  const color = variant === 'navy' ? '#1B2A4A' : variant === 'cream' ? '#F6F2E9' : '#B8924A';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title="Notary Passport Official Seal"
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer Ring */}
        <circle cx="60" cy="60" r="56" stroke={color} strokeWidth="2.5" />
        {/* Inner Ring */}
        <circle cx="60" cy="60" r="50" stroke={color} strokeWidth="1" />

        {/* Top Text */}
        <text
          x="60"
          y="28"
          fill={color}
          fontSize="9"
          fontWeight="600"
          fontFamily="IBM Plex Sans, sans-serif"
          textAnchor="middle"
          letterSpacing="1.2"
        >
          NOTARY PASSPORT
        </text>

        {/* Center NP Monogram */}
        <text
          x="60"
          y="66"
          fill={color}
          fontSize="30"
          fontWeight="700"
          fontFamily="Fraunces, serif"
          textAnchor="middle"
        >
          NP
        </text>

        {/* Bottom Text */}
        <text
          x="60"
          y="95"
          fill={color}
          fontSize="7.5"
          fontWeight="600"
          fontFamily="IBM Plex Sans, sans-serif"
          textAnchor="middle"
          letterSpacing="1.5"
        >
          VERIFIED · US · CA
        </text>
      </svg>
    </div>
  );
};
