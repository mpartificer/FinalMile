import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import Lightbox from "./Lightbox";

const ImageUploader = ({ setDeliveryPhotos, deliveryPhotos = [] }) => {
    const [previewImages, setPreviewImages] = useState([]);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const fileInputRef = useRef(null);

    function handleChange(e) {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
            
            // Update preview images
            setPreviewImages(prev => [...prev, ...newPreviewUrls]);
            
            // Pass the actual file objects to parent
            setDeliveryPhotos(prev => [...prev, ...newFiles]);
        }
    }

    const removeImage = (index) => {
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setDeliveryPhotos(prev => prev.filter((_, i) => i !== index));
    };

    React.useEffect(() => {
        if (deliveryPhotos.length === 0) {
            setPreviewImages([]);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [deliveryPhotos]);

    const openLightbox = (index) => {
        setSelectedImageIndex(index);
        setIsLightboxOpen(true);
    };
 
    return (
        <div className="space-y-4">
            <input 
                ref={fileInputRef}
                type="file" 
                className="file-input file-input-bordered file-input-secondary w-full max-w-xs" 
                onChange={handleChange}
                accept="image/*"
                multiple
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {previewImages.map((url, index) => (
                    <div key={index} className="relative group">
                        <img
                            src={url}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-48 object-cover rounded cursor-pointer"
                            onClick={() => openLightbox(index)}
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                removeImage(index);
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X size={16} />
                        </button>
                    </div>
                ))}
            </div>
            <Lightbox
                isOpen={isLightboxOpen}
                onClose={() => setIsLightboxOpen(false)}
                images={previewImages}
                currentIndex={selectedImageIndex}
                setCurrentIndex={setSelectedImageIndex}
            />
        </div>
    );
};

export default ImageUploader