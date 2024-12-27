import { CheckCircle, XCircle, Info } from 'lucide-react';

// Base toast style
const baseToastStyle = {
  padding: '16px',
  borderRadius: '12px',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  background: '#fff',
  color: '#374151',
};

// Toast variants
export const toastStyles = {
  success: {
    style: {
      ...baseToastStyle,
      border: '2px solid #22c55e',
    },
    icon: CheckCircle,
  },
  error: {
    style: {
      ...baseToastStyle,
      border: '2px solid #ef4444',
    },
    icon: XCircle,
  },
  info: {
    style: {
      ...baseToastStyle,
      border: '2px solid #3b82f6',
    },
    icon: Info,
  },
};

// Toast configuration
export const toastConfig = {
  duration: 3000,
  position: 'top-center',
};