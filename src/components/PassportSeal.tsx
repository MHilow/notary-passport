import React from 'react';

interface PassportSealProps {
  size?: number; // e.g. 64 or 84
  variant?: 'navy' | 'gold' | 'cream';
  className?: string;
}

export const PassportSeal: React.FC<PassportSealProps> = ({
  size = 64,
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
        <circle cx="60" cy="60" r="55" stroke={color} strokeWidth="3.5" />
        {/* Inner Ring */}
        <circle cx="60" cy="60" r="48" stroke={color} strokeWidth="1.5" />

        {/* Top Text */}
        <text
          x="60"
          y="27"
          fill={color}
          fontSize="10.5"
          fontWeight="800"
          fontFamily="IBM Plex Sans, sans-serif"
          textAnchor="middle"
          letterSpacing="1.4"
        >
          NOTARY PASSPORT
        </text>

        {/* Center NP Monogram */}
        <text
          x="60"
          y="66"
          fill={color}
          fontSize="36"
          fontWeight="900"
          fontFamily="Fraunces, serif"
          textAnchor="middle"
        >
          NP
        </text>

        {/* Bottom Text */}
        <text
          x="60"
          y="94"
          fill={color}
          fontSize="9"
          fontWeight="800"
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

