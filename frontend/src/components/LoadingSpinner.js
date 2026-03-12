import React from 'react';

const sizeMap = { small: 16, medium: 32, large: 48, xlarge: 64 };

const LoadingSpinner = ({ size = 'medium', className = '' }) => {
  const px = sizeMap[size] || sizeMap.medium;
  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-2 border-solid border-current border-r-transparent ${className}`}
      style={{
        width: px,
        height: px,
        borderColor: 'currentColor',
        borderRightColor: 'transparent',
      }}
    />
  );
};

export default LoadingSpinner;
