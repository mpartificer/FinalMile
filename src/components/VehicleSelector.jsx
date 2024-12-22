import React, { useState } from 'react';
import { Car, Truck, Bus, Caravan } from 'lucide-react'

const VehicleSelector = ({ setVehicleSize }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setVehicleSize(vehicle);
  };

  return (
    <div>
      <div className="grid grid-cols-2 center justify-stretch items-stretch">
        <button
            type="button"
          className={`px-4 py-2 rounded-lg m-1 bg-secondary text-base-100 ${selectedVehicle === 'Car' ? 'bg-blue-500 text-base-100' : 'bg-secondary'}`}
          onClick={() => handleVehicleSelect('Car')}
        >
        <span className="flex justify-center">
        <Car color="#FFFFFF"/>
        </span>
          Car
        </button>
        <button
        type="button"
          className={`px-4 py-2 rounded-lg m-1 bg-secondary text-base-100 ${selectedVehicle === 'Pickup' ? 'bg-blue-500 text-base-100' : 'bg-secondary'}`}
          onClick={() => handleVehicleSelect('Pickup')}
        >
            <span className="flex justify-center">
            <Truck color="#FFFFFF"/>
            </span>
          Pickup
        </button>
        <button
        type="button"
          className={`px-4 py-2 rounded-lg m-1 bg-secondary text-base-100 ${selectedVehicle === 'Van' ? 'bg-blue-500 text-base-100' : 'bg-secondary'}`}
          onClick={() => handleVehicleSelect('Van')}
        >
            <span className="flex justify-center">
            <Bus color="#FFFFFF"/>
            </span>
          Van
        </button>
        <button
        type="button"
          className={`px-4 py-2 rounded-lg m-1 bg-secondary text-base-100 ${selectedVehicle === 'Flatbed' ? 'bg-blue-500 text-base-100' : 'bg-secondary'}`}
          onClick={() => handleVehicleSelect('Flatbed')}
        >
            <span className="flex justify-center">
            <Caravan color="#FFFFFF"/>
            </span>
          Flatbed
        </button>
      </div>
    </div>
  );
};

export default VehicleSelector;