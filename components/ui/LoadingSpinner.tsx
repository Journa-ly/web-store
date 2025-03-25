import ClipLoader from 'react-spinners/ClipLoader';

interface LoadingSpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string;
}

export default function LoadingSpinner({ size = 'md', color }: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: 'loading-xs',
    sm: 'loading-sm',
    md: 'loading-md',
    lg: 'loading-lg'
  };

  return (
    <span 
      className={`loading loading-spinner ${sizeClasses[size]} ${color ? '' : 'text-primary'}`} 
      style={color ? { color } : undefined}
    />
  );
} 