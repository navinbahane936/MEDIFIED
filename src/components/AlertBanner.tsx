import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

type AlertBannerProps = {
  message: string;
  severity?: 'critical' | 'warning' | 'info' | 'informational';
  onDismiss?: () => void;
};

export default function AlertBanner({ message, severity = 'critical', onDismiss }: AlertBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  const severityStyles = {
    critical: 'bg-red-900/30 border-red-500/50 text-red-200',
    warning: 'bg-yellow-900/30 border-yellow-500/50 text-yellow-200',
    info: 'bg-blue-900/30 border-blue-500/50 text-blue-200',
    informational: 'bg-green-900/30 border-green-500/50 text-green-200',
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <div className={`border rounded-lg p-3 md:p-4 flex items-start gap-3 ${severityStyles[severity]}`}>
      <AlertCircle className="w-5 h-5 md:w-6 md:h-6 flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm md:text-base font-medium">{message}</p>
      <button
        onClick={handleClose}
        className="text-current hover:opacity-70 transition-opacity flex-shrink-0"
      >
        <X className="w-4 h-4 md:w-5 md:h-5" />
      </button>
    </div>
  );
}
