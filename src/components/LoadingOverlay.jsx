import React from 'react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';


const LoadingOverlay = ({ message = "Processing..." }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full text-center">
        <div className="w-64 h-64 mx-auto mb-4 flex items-center justify-center">
        <DotLottieReact 
  src="../assets/icons/truckanimation.lottie"  // Note: file should be in public directory
  loop 
  autoplay 
/>        </div>
        <p className="text-xl font-medium text-gray-900">
          {message}
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;