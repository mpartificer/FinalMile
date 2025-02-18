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
        className="bg-white w-full p-3 mb-4 border border-gray-200 rounded-lg text-gray-900 focus:bg-white hover:bg-white"
        style={{
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          appearance: 'none',
          colorScheme: 'light',
          height: '48px', // Explicitly set height
          minHeight: '48px', // Ensure minimum height
          lineHeight: '1.25' // Match other inputs line height
        }}
      />
      {showPlaceholder && (
        <div 
          className="absolute inset-0 flex items-center pointer-events-none"
          style={{ 
            marginBottom: '1rem'
          }}
        >
          <span className="px-3 text-gray-400">Deliver By</span>
        </div>
      )}
      <Calendar 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
        style={{ marginTop: '-0.5rem' }}
        size={24} 
      />
      <style>{`
        /* Hide the default calendar picker indicator */
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          width: 100%;
          height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          cursor: pointer;
        }
        
        /* Hide the default date text when empty */
        input[type="date"]:not(:focus):not([value=""]) {
          color: #111827;
        }
        
        input[type="date"]::before {
          color: #9CA3AF;
        }
        
        /* Remove the default date format text */
        input[type="date"]::-webkit-datetime-edit-fields-wrapper {
          opacity: ${value ? 1 : 0};
        }

        /* Force consistent height on iOS */
        @supports (-webkit-touch-callout: none) {
          input[type="date"] {
            min-height: 48px !important;
            height: 48px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default DatePicker;