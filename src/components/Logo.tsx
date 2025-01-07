import React from 'react';

export function Logo({ className = "h-8 w-8", color = "currentColor" }) {
  return (
    <svg
      viewBox="4 4 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g
        stroke={color}
        strokeWidth="01"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        {/* Five identical petals rotated at 72° intervals, moved outward from center */}
        <path d="M12 12 C14.5 9.5, 16.5 9.5, 18.5 11.5 C16.5 13.5, 14.5 13.5, 12 12" />
        <path d="M12 12 C14.5 9.5, 16.5 9.5, 18.5 11.5 C16.5 13.5, 14.5 13.5, 12 12" transform="rotate(72, 12, 12)" />
        <path d="M12 12 C14.5 9.5, 16.5 9.5, 18.5 11.5 C16.5 13.5, 14.5 13.5, 12 12" transform="rotate(144, 12, 12)" />
        <path d="M12 12 C14.5 9.5, 16.5 9.5, 18.5 11.5 C16.5 13.5, 14.5 13.5, 12 12" transform="rotate(216, 12, 12)" />
        <path d="M12 12 C14.5 9.5, 16.5 9.5, 18.5 11.5 C16.5 13.5, 14.5 13.5, 12 12" transform="rotate(288, 12, 12)" />
      </g>
    </svg>
  );
} 