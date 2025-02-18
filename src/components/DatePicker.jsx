import React, { useState } from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({ value, onChange }) => {
  const [isFocused, setIsFocused] = useState(false);
  const showPlaceholder = !value && !isFocused;

  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="bg-white w-full p-3 mb-4 border border-gray-200 rounded-lg text-gray-900 
                 focus:outline-none focus:ring-0 focus:border-gray-200"
        style={{
          "-webkit-appearance": "none",
          "-moz-appearance": "none",
          "appearance": "none",
        }}
      />
      <Calendar 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
        size={24} 
      />
      {showPlaceholder && (
        <div 
          className="absolute inset-0 flex items-center pointer-events-none px-3" 
          style={{ 
            background: 'transparent',
            WebkitTextFillColor: '#9CA3AF'
          }}
        >
          Deliver By
        </div>
      )}
    </div>
  );
};

export default DatePicker;