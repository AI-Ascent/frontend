'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { XMarkIcon, ExclamationTriangleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  duration?: number;
}

interface ToastContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  hideToast: (id: string) => void;
  showErrorToast: (message: string, retryAction?: () => void) => void;
  showSuccessToast: (message: string) => void;
  showWarningToast: (message: string) => void;
  showInfoToast: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const hideToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000,
    };

    setToasts(prev => [...prev, newToast]);

    // Auto-hide after duration
    setTimeout(() => {
      hideToast(id);
    }, newToast.duration);
  }, [hideToast]);

  const showErrorToast = useCallback((message: string, retryAction?: () => void) => {
    showToast({
      type: 'error',
      title: 'Error',
      message,
      action: retryAction ? {
        label: 'Retry',
        onClick: retryAction,
      } : undefined,
      duration: 8000, // Longer duration for errors
    });
  }, [showToast]);

  const showSuccessToast = useCallback((message: string) => {
    showToast({
      type: 'success',
      title: 'Success',
      message,
      duration: 3000,
    });
  }, [showToast]);

  const showWarningToast = useCallback((message: string) => {
    showToast({
      type: 'warning',
      title: 'Warning',
      message,
      duration: 5000,
    });
  }, [showToast]);

  const showInfoToast = useCallback((message: string) => {
    showToast({
      type: 'info',
      title: 'Info',
      message,
      duration: 4000,
    });
  }, [showToast]);

  const getToastIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <InformationCircleIcon className="h-5 w-5 text-blue-500" />;
    }
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <ToastContext.Provider value={{
      showToast,
      hideToast,
      showErrorToast,
      showSuccessToast,
      showWarningToast,
      showInfoToast,
    }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 left-4 sm:left-auto sm:max-w-md z-50 space-y-2 max-h-screen overflow-y-auto">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`w-full bg-white border-l-4 shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 ${getToastStyles(toast.type)}`}
            style={{ 
              wordWrap: 'break-word', 
              overflowWrap: 'break-word',
              whiteSpace: 'normal',
              writingMode: 'horizontal-tb',
              textOrientation: 'mixed'
            }}
          >
            <div className="p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {getToastIcon(toast.type)}
                </div>
                <div className="ml-3 flex-1 pt-0.5" style={{ minWidth: 0, maxWidth: '100%' }}>
                  <p className="text-sm font-medium" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{toast.title}</p>
                  <p className="mt-1 text-sm opacity-90" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{toast.message}</p>
                  {toast.action && (
                    <div className="mt-3">
                      <button
                        onClick={toast.action.onClick}
                        className="text-sm font-medium hover:underline focus:outline-none focus:underline"
                        style={{ whiteSpace: 'normal' }}
                      >
                        {toast.action.label}
                      </button>
                    </div>
                  )}
                </div>
                <div className="ml-4 flex-shrink-0 flex">
                  <button
                    className="bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => hideToast(toast.id)}
                  >
                    <span className="sr-only">Close</span>
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
