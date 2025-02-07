import React from 'react';

const DatePicker = ({ value, onChange }) => {
  return (
    <div className="relative mb-4">
      <input
        type="date"
        value={value}
        onChange={onChange}
        required
        className="bg-white w-full p-3 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400"
      />
      <style>
        {`
          /* Hide default placeholder */
          input[type="date"]::-webkit-datetime-edit-fields-wrapper { 
            opacity: ${value ? 1 : 0};
          }
          
          /* Show custom placeholder */
          input[type="date"]::before {
            color: #9CA3AF;
            content: "Deliver By";
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            display: ${value ? 'none' : 'block'};
          }
          
          /* Style the calendar picker icon */
          input[type="date"]::-webkit-calendar-picker-indicator {
            color: rgba(0, 0, 0, 0);
            opacity: 1;
            display: block;
            background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 24 24"><path fill="%23666" d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z"/></svg>') center / contain no-repeat;
            width: 20px;
            height: 20px;
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
          }

          /* Style the text when a date is selected */
          input[type="date"] {
            color: #111827;
          }
        `}
      </style>
    </div>
  );
};

export default DatePicker;