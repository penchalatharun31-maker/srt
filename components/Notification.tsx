import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/appStore';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

const Notification: React.FC = () => {
  const { notification, clearNotification } = useAppStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (notification) {
      setShow(true);
      const timer = setTimeout(() => {
        // Start fade out before clearing
        setShow(false);
      }, 2500);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  // Handle the actual data clearing after fade-out transition
  const handleTransitionEnd = () => {
      if (!show) {
          clearNotification();
      }
  };

  if (!notification) {
    return null;
  }

  const isError = notification.type === 'error';

  return (
    <div
      onTransitionEnd={handleTransitionEnd}
      className={`fixed top-5 right-5 z-[100] transform transition-all duration-300 ease-in-out ${show ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}
    >
      <div className={`flex items-center p-4 rounded-lg shadow-lg text-white ${isError ? 'bg-red-500' : 'bg-green-500'}`}>
        <div className="flex-shrink-0">
          {isError ? <XCircleIcon className="w-6 h-6" /> : <CheckCircleIcon className="w-6 h-6" />}
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium">{notification.message}</p>
        </div>
      </div>
    </div>
  );
};

export default Notification;
