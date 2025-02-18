import React from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({ value, onChange }) => {
  return (
    <div className="relative mb-4">
      <div className="relative">
        <input
          type="date"
          value={value}
          onChange={onChange}
          className="bg-white w-full p-3 pr-12 border border-gray-200 rounded-lg text-gray-900 
                   placeholder:text-gray-400 focus:bg-white hover:bg-white"
          style={{
            // Reset browser styles
            "-webkit-appearance": "none",
            "-moz-appearance": "none",
            "appearance": "none",
            // Ensure consistent sizing
            "min-height": "48px",
            // Force display of calendar icon on iOS
            "background-color": "white"
          }}
          placeholder="Deliver By"
        />
        <Calendar 
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
          size={24} 
        />
      </div>
    </div>
  );
};

export default DatePicker;