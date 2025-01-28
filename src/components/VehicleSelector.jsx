import React, { useState } from 'react';
import { Truck, Car, Flatbed, Van } from '../assets/icons';


const VehicleSelector = ({ setVehicleSize }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleSize(vehicle);
  };

  const getButtonStyles = (vehicleType) => {
    const isSelected = selectedVehicle === vehicleType;
    return `px-4 py-2 rounded-lg m-1 transition-all duration-200 ${
      isSelected 
        ? 'bg-blue-600 ring-2 ring-blue-600' 
        : 'bg-gray-100 hover:bg-gray-200'
    }`;
  };

  const getIconColor = (vehicleType) => {
    return selectedVehicle === vehicleType ? '#FFFFFF' : '#374151';
  };

  const getTextColor = (vehicleType) => {
    return selectedVehicle === vehicleType ? 'text-white' : 'text-gray-700';
  };

  return (
    <div>
      <div className="grid grid-cols-2 center justify-stretch items-stretch">
        <button
          type="button"
          className={getButtonStyles('Car')}
          onClick={() => handleVehicleSelect('Car')}
        >
          <span className="flex flex-col items-center gap-2">
            <img src={Car} alt="Car" className="w-6 h-6" />
            <span className={getTextColor('Car')}>Car</span>
          </span>
        </button>
        
        <button
          type="button"
          className={getButtonStyles('Pickup')}
          onClick={() => handleVehicleSelect('Pickup')}
        >
          <span className="flex flex-col items-center gap-2">
            <img src={Truck} alt="Pickup" className="w-6 h-6" />
            <span className={getTextColor('Pickup')}>Pickup</span>
          </span>
        </button>
        
        <button
          type="button"
          className={getButtonStyles('Van')}
          onClick={() => handleVehicleSelect('Van')}
        >
          <span className="flex flex-col items-center gap-2">
            <img src={Van} alt="Van" className="w-6 h-6" />
            <span className={getTextColor('Van')}>Van</span>
          </span>
        </button>
        
        <button
          type="button"
          className={getButtonStyles('Flatbed')}
          onClick={() => handleVehicleSelect('Flatbed')}
        >
          <span className="flex flex-col items-center gap-2">
            <img src={Flatbed} alt="Flatbed" className="w-6 h-6" />
            <span className={getTextColor('Flatbed')}>Flatbed</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default VehicleSelector;