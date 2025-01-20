import React, { useState, useRef } from "react";
 
const ImageUploader = ({ setDeliveryPhoto, deliveryPhoto }) => {
    const [previewImage, setPreviewImage] = useState(null);
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
                <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="mt-2 max-w-xs"
                    style={{ maxHeight: '200px' }}
                />
            )}
        </div>
    );
}
 
export default ImageUploader;