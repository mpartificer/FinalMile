import React, { useState } from "react";
 
const ImageUploader = ({ setDeliveryPhoto }) => {
    const [previewImage, setPreviewImage] = useState(null);

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
 
    return (
        <div className="">
            <input 
                type="file" 
                className="file-input file-input-bordered file-input-secondary w-full max-w-xs" 
                onChange={handleChange}
                accept="image/*" // Optional: restrict to image files only
            />
            {previewImage && (
                <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="mt-2 max-w-xs"
                    style={{ maxHeight: '200px' }} // Optional: control preview size
                />
            )}
        </div>
    );
}
 
export default ImageUploader;