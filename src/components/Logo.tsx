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
      <path d="M15 4V2"/>
      <path d="M15 16v-2"/>
      <path d="M8 9h2"/>
      <path d="M20 9h2"/>
      <path d="M17.8 11.8 19 13"/>
      <path d="M15 9h.01"/>
      <path d="M17.8 6.2 19 5"/>
      <path d="M12 11.8 11 13"/>
      <path d="M12 6 11 5"/>
    </svg>
  );
} 