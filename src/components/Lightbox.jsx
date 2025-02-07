import React from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

const Lightbox = ({ isOpen, onClose, images, currentIndex, setCurrentIndex }) => {
    if (!isOpen) return null;

    const goToPrevious = (e) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
    };

    const goToNext = (e) => {
        e.stopPropagation();
        setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 cursor-pointer"
            onClick={onClose}
        >
            <div className="relative max-w-7xl max-h-[90vh] mx-4">
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 p-2 text-white hover:text-gray-300 transition-colors"
                >
                    <X size={24} />
                </button>
                
                {images.length > 1 && (
                    <>
                        <button
                            onClick={goToPrevious}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            onClick={goToNext}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-opacity"
                        >
                            <ChevronRight size={24} />
                        </button>
                    </>
                )}
                
                <img
                    src={images[currentIndex]}
                    alt={`Image ${currentIndex + 1} of ${images.length}`}
                    className="max-w-full max-h-[85vh] object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                />
                
                {images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black bg-opacity-50 px-4 py-2 rounded-full text-white">
                        {currentIndex + 1} / {images.length}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Lightbox