import React from 'react';
import Link from 'next/link';

export default function GroundStateLogo({ size = 28, showText = true, className = '' }) {
  return (
    <Link href="/" className={`brand-logo ${className}`}>
      <span className="brand-icon" style={{ width: size, height: size }}>
        <svg
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Main Leaf Body with Glow */}
          <path
            d="M8.5 24.5C6.5 21 6.2 16.5 7.8 12.8C9.4 9.1 13 6 17.5 5C22 4 25.5 5.5 27 7C28.5 8.5 30 12 29 16.5C28 21 24.9 24.6 21.2 26.2C17.5 27.8 13 27.5 9.5 25.5L8.5 24.5Z"
            fill="#34e79a"
            fillOpacity="0.22"
          />
          <path
            d="M6 26C8 21.5 12 14 26 6C23 18 16 24 6 26Z"
            fill="#34e79a"
          />
          {/* Delicate internal vein stroke */}
          <path
            d="M9 23C13 19 19 14 24 8"
            stroke="#0a1a12"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path
            d="M13 18C15 17 18 18 19 19"
            stroke="#0a1a12"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M17 14C19 13 21 14 22 15"
            stroke="#0a1a12"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {showText && <span>GroundState</span>}
    </Link>
  );
}
