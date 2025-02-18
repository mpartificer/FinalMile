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
        className="bg-white w-full p-3 mb-4 border border-gray-200 rounded-lg text-gray-900 appearance-none"
        style={{
          colorScheme: 'light',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          background: 'white'
        }}
      />
      {/* Overlay to hide the default date format text */}
      {!value && (
        <div 
          className="absolute inset-0 bg-white pointer-events-none flex items-center px-3"
          style={{ marginBottom: '1rem' }}
        >
          <span className="text-gray-400">Deliver By</span>
        </div>
      )}
      <Calendar 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" 
        style={{ marginTop: '-0.5rem' }}
        size={24} 
      />
      <style>{`
        /* Hide the default date picker icon */
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          width: 100%;
          height: 100%;
          position: absolute;
          right: 0;
          top: 0;
          cursor: pointer;
        }
        
        /* Remove inner shadow on iOS */
        input[type="date"] {
          -webkit-appearance: none;
          box-shadow: none !important;
        }
        
        /* Remove any default styling */
        input[type="date"]::-webkit-datetime-edit {
          color: var(--tw-text-opacity);
        }
        
        input[type="date"]::-webkit-datetime-edit-fields-wrapper {
          padding: 0;
        }
        
        input[type="date"]::-webkit-datetime-edit-text,
        input[type="date"]::-webkit-datetime-edit-month-field,
        input[type="date"]::-webkit-datetime-edit-day-field,
        input[type="date"]::-webkit-datetime-edit-year-field {
          color: inherit;
        }
        
        /* Hide the placeholder when value exists */
        input[type="date"]:not(:placeholder-shown) + div {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default DatePicker;