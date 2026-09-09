import React from 'react';

interface ScallopedSealProps {
  size?: number; // e.g. 76, 104, 128
  showAccents?: boolean;
  className?: string;
}

export const ScallopedSeal: React.FC<ScallopedSealProps> = ({
  size = 76,
  showAccents = true,
  className = '',
}) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
      title="Notary Passport Verified Seal Logo"
    >
      <svg
        width={size}
        height={size}
        viewBox="10 5 190 160"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Decorative Outer Accents */}
        {showAccents && (
          <g>
            {/* Top-Right 4-point Gold Star */}
            <path
              d="M182 14 L185 28 L198 31 L185 34 L182 48 L179 34 L166 31 L179 28 Z"
              fill="#B8924A"
            />
            {/* Top-Right Green Dot */}
            <circle cx="158" cy="38" r="5" fill="#3F6B4F" />

            {/* Top-Left Gold Dot */}
            <circle cx="44" cy="42" r="6" fill="#B8924A" />

            {/* Left Green Star */}
            <path
              d="M18 104 L20 113 L29 115 L20 117 L18 126 L16 117 L7 115 L16 113 Z"
              fill="#3F6B4F"
            />

            {/* Bottom-Left Navy Dot */}
            <circle cx="36" cy="144" r="5.5" fill="#1B2A4A" />

            {/* Bottom-Right Oxblood Star */}
            <path
              d="M174 154 L176 162 L184 164 L176 166 L174 174 L172 166 L164 164 L172 162 Z"
              fill="#7A3B34"
            />
            {/* Bottom-Right Oxblood Dot */}
            <circle cx="162" cy="136" r="5.5" fill="#7A3B34" />
          </g>
        )}

        {/* Outer Scalloped Navy Ring (Bold Border) */}
        <path
          d="M 105 16 
             C 118 16, 124 21, 133 24 
             C 142 27, 150 27, 158 34 
             C 165 41, 167 49, 172 57 
             C 177 65, 181 72, 181 83 
             C 181 94, 177 101, 172 109 
             C 167 117, 165 125, 158 132 
             C 150 139, 142 139, 133 142 
             C 124 145, 118 150, 105 150 
             C 92 150, 86 145, 77 142 
             C 68 139, 60 139, 52 132 
             C 45 125, 43 117, 38 109 
             C 33 101, 29 94, 29 83 
             C 29 72, 33 65, 38 57 
             C 43 49, 45 41, 52 34 
             C 60 27, 68 27, 77 24 
             C 86 21, 92 16, 105 16 Z"
          fill="#F6F2E9"
          stroke="#1B2A4A"
          strokeWidth="8"
          strokeLinejoin="round"
        />

        {/* Inner Gold Dashed Circle */}
        <circle
          cx="105"
          cy="83"
          r="52"
          stroke="#B8924A"
          strokeWidth="3.5"
          strokeDasharray="6 4"
          fill="none"
        />

        {/* Center Extra Bold Sans-Serif "NP" Monogram */}
        <text
          x="105"
          y="88"
          fill="#1B2A4A"
          fontSize="52"
          fontWeight="900"
          fontFamily="IBM Plex Sans, sans-serif"
          textAnchor="middle"
          letterSpacing="-1.5"
        >
          NP
        </text>

        {/* Verified Green Pill Badge */}
        <rect
          x="61"
          y="100"
          width="88"
          height="22"
          rx="11"
          fill="#3F6B4F"
        />
        <text
          x="105"
          y="115"
          fill="#FFFFFF"
          fontSize="11.5"
          fontWeight="900"
          fontFamily="IBM Plex Sans, sans-serif"
          textAnchor="middle"
          letterSpacing="1.2"
        >
          VERIFIED
        </text>
      </svg>
    </div>
  );
};

