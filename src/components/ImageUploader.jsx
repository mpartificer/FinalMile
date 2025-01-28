import React, { useState, useRef } from "react";
import Lightbox from "./Lightbox";


const ImageUploader = ({ setDeliveryPhoto, deliveryPhoto }) => {
    const [previewImage, setPreviewImage] = useState(null);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const fileInputRef = useRef(null);

    function handleChange(e) {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            
            // Create URL for preview image
            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
            
            // Pass the actual file object to parent
            setDeliveryPhoto(file);
        }
    }

    React.useEffect(() => {
        if (!deliveryPhoto) {
            setPreviewImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [deliveryPhoto]);
 
    return (
        <div className="">
            <input 
                ref={fileInputRef}
                type="file" 
                className="file-input file-input-bordered file-input-secondary w-full max-w-xs" 
                onChange={handleChange}
                accept="image/*"
            />
            {previewImage && (
                <div className="mt-4">
                    <img
                        src={previewImage}
                        alt="Preview"
                        className="max-w-full h-auto rounded cursor-pointer"
                        onClick={() => setIsLightboxOpen(true)}
                    />
                    <Lightbox
                        isOpen={isLightboxOpen}
                        onClose={() => setIsLightboxOpen(false)}
                        imageUrl={previewImage}
                    />
                </div>
            )}
        </div>
    );
}
 
export default ImageUploader;