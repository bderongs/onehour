import { Logo } from './Logo';

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

interface BrandNameProps {
  className?: string;
  color?: TailwindColor;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandName({ className = '', color = 'indigo-900', size = 'md' }: BrandNameProps) {
  const sizes = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-4xl'
  };

  const logoSizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-16 w-16'
  };

  const getColorClass = (color: TailwindColor) => {
    const colorClasses: Record<TailwindColor, string> = {
      'blue-50': 'text-blue-50',
      'blue-100': 'text-blue-100',
      'blue-200': 'text-blue-200',
      'blue-300': 'text-blue-300',
      'blue-400': 'text-blue-400',
      'blue-500': 'text-blue-500',
      'blue-600': 'text-blue-600',
      'blue-700': 'text-blue-700',
      'blue-800': 'text-blue-800',
      'blue-900': 'text-blue-900',
      'blue-950': 'text-blue-950',
      'indigo-50': 'text-indigo-50',
      'indigo-100': 'text-indigo-100',
      'indigo-200': 'text-indigo-200',
      'indigo-300': 'text-indigo-300',
      'indigo-400': 'text-indigo-400',
      'indigo-500': 'text-indigo-500',
      'indigo-600': 'text-indigo-600',
      'indigo-700': 'text-indigo-700',
      'indigo-800': 'text-indigo-800',
      'indigo-900': 'text-indigo-900',
      'indigo-950': 'text-indigo-950',
      'black': 'text-black',
      'white': 'text-white'
    };
    return colorClasses[color] || 'text-gray-900';
  };

  const colorClass = getColorClass(color);

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Logo className={`${logoSizes[size]}`} color={color} />
      <span className={`font-semibold ${sizes[size]} ${colorClass} leading-none`}>
        Sparkier
      </span>
    </div>
  );
} 