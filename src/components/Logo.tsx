import { useMemo } from 'react';

type TailwindColor =
  | `${string}-50`
  | `${string}-100`
  | `${string}-200`
  | `${string}-300`
  | `${string}-400`
  | `${string}-500`
  | `${string}-600`
  | `${string}-700`
  | `${string}-800`
  | `${string}-900`
  | `${string}-950`
  | 'white'
  | 'black';

interface LogoProps {
  className?: string;
  color?: TailwindColor;
}

export function Logo({ className = "h-8 w-8", color = "indigo-900" }: LogoProps) {
  const getColorValue = useMemo(() => {
    const colorMap: Partial<Record<TailwindColor, string>> = {
      'white': '#ffffff',
      'black': '#000000',
      'indigo-50': '#eef2ff',
      'indigo-100': '#e0e7ff',
      'indigo-200': '#c7d2fe',
      'indigo-300': '#a5b4fc',
      'indigo-400': '#818cf8',
      'indigo-500': '#6366f1',
      'indigo-600': '#4f46e5',
      'indigo-700': '#4338ca',
      'indigo-800': '#3730a3',
      'indigo-900': '#312e81',
      'indigo-950': '#1e1b4b'
    };
    return colorMap[color] || 'currentColor';
  }, [color]);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke={getColorValue}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 4V1"/>
      <path d="M12 23v-3"/>
      <path d="M1 12h3"/>
      <path d="M20 12h3"/>
      <path d="M17.7 17.7 20 20"/>
      <path d="M12 12h.01"/>
      <path d="M17.7 6.3 20 4"/>
      <path d="M6.3 17.7 4 20"/>
      <path d="M6.3 6.3 4 4"/>
    </svg>
  );
} 