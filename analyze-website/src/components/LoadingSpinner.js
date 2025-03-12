import React from 'react';

const LoadingSpinner = ({ size = 'medium', message }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className={`${sizeClasses[size]} border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin`}></div>
      {message && (
        <p className="mt-3 text-gray-600 text-center">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner; 