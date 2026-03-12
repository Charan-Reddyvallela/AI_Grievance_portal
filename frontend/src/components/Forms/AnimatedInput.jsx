import React, { useState, useEffect, useRef } from 'react';

const AnimatedInput = ({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  name = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setHasValue(value.length > 0);
  }, [value]);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const inputId = `input-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className={`relative ${className}`}>
      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder || ' '}
        required={required}
        disabled={disabled}
        className={`
          auth-input
          w-full px-4 py-3 rounded-lg border transition-all duration-200
          bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600
          text-gray-900 dark:text-gray-100 placeholder-transparent
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          ${isFocused || hasValue ? 'auth-input--focused' : ''}
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      />
      
      <label
        htmlFor={inputId}
        className={`
          auth-input-label
          absolute left-4 transition-all duration-200 pointer-events-none
          text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 px-1
          ${isFocused || hasValue
            ? 'auth-input-label--focused -top-2 text-sm text-blue-500 dark:text-blue-400'
            : 'top-3 text-base'
          }
          ${error ? 'text-red-500' : ''}
        `}
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {error && (
        <div className="animate-fade-in mt-1">
          <p className="text-sm text-red-500 dark:text-red-400 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default AnimatedInput;
