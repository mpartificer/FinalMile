import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const showPlaceholder = !value && !isFocused;

  return (
    <div className="relative">
      <div className="relative">
        <style>
          {`
            input[type="date"]::-webkit-calendar-picker-indicator {
              opacity: 0;
              position: absolute;
              right: 0;
              top: 0;
              width: 100%;
              height: 100%;
              cursor: pointer;
            }
            input[type="date"]::-webkit-inner-spin-button,
            input[type="date"]::-webkit-clear-button {
              display: none;
            }
          `}
        </style>
        <input
          type="date"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="bg-white w-full p-3 pr-12 mb-4 border border-gray-200 rounded-lg text-gray-900 placeholder:text-gray-400 
                   focus:bg-white hover:bg-white"
          style={{
            "-webkit-appearance": "none",
            "-moz-appearance": "none",
            "appearance": "none",
            "min-height": "48px",
            "background-color": "white",
            "colorScheme": "light"
          }}
        />
        {showPlaceholder && (
          <div 
            className="absolute inset-0 flex items-center pointer-events-none" 
            style={{ 
              background: 'white',
              WebkitTextFillColor: '#9CA3AF'
            }}
          >
            <span className="px-3">Deliver By</span>
          </div>
        )}
        <Calendar 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none z-10" 
          size={24} 
        />
      </div>
    </div>
  );
};

export default DatePicker;