import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const showPlaceholder = !value && !isFocused;

  return (
    <div className="relative mb-4">
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="bg-white w-full p-3 pr-12 border border-gray-200 rounded-lg text-gray-900 
                   focus:bg-white hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 
                   focus:border-transparent"
          style={{
            "-webkit-appearance": "none",
            "-moz-appearance": "none",
            "appearance": "none",
            "min-height": "48px",
            "background-color": "white",
            colorScheme: 'light',
            "::-webkit-calendar-picker-indicator": {
              display: 'none'
            },
            "::-webkit-inner-spin-button": {
              display: 'none'
            },
            "::-webkit-clear-button": {
              display: 'none'
            }
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
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
          size={24} 
        />
      </div>
    </div>
  );
};

export default DatePicker;