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

  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Logo className={`${logoSizes[size]} text-${color}`} />
      <span className={`font-semibold ${sizes[size]} text-${color} leading-none`}>
        Sparkier
      </span>
    </div>
  );
} 