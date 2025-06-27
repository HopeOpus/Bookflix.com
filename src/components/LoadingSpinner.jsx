import { BookOpen } from 'lucide-react';

const LoadingSpinner = ({ size = 'md', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-8">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-neutral-600 border-t-primary-500 rounded-full animate-spin`}></div>
        <BookOpen className={`${sizeClasses[size]} absolute inset-0 text-primary-500 animate-pulse`} />
      </div>
      <p className="text-neutral-400 text-sm font-medium">{text}</p>
    </div>
  );
};

export default LoadingSpinner;