import { AlertTriangle, RefreshCw } from 'lucide-react';

const ErrorMessage = ({ 
  message = 'Something went wrong', 
  onRetry = null,
  type = 'error' 
}) => {
  const typeStyles = {
    error: 'border-red-500/20 bg-red-500/10 text-red-400',
    warning: 'border-accent-500/20 bg-accent-500/10 text-accent-400',
    info: 'border-primary-500/20 bg-primary-500/10 text-primary-400'
  };

  return (
    <div className={`border rounded-lg p-6 text-center animate-fade-in ${typeStyles[type]}`}>
      <AlertTriangle className="w-12 h-12 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">Oops!</h3>
      <p className="mb-4 text-sm opacity-90">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="btn-primary inline-flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;