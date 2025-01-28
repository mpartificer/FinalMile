import React from 'react';

const DatePicker = ({ value, onChange, className }) => {
  return (
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={onChange}
        className={`
          bg-white w-full p-3 pr-10 border border-gray-200 rounded-lg
          text-gray-400 placeholder:text-gray-400
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
          [&::-webkit-calendar-picker-indicator]:opacity-100
          [&::-webkit-calendar-picker-indicator]:hover:cursor-pointer
          [&::-webkit-calendar-picker-indicator]:text-gray-600
          [&::-webkit-calendar-picker-indicator]:hover:text-blue-500
          ${className || ''}
        `}
      />
      <svg
        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    </div>
  );
};

export default DatePicker;