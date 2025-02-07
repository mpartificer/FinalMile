// ImageUploader.jsx
import React, { useState, useRef } from "react";
import { X } from "lucide-react";
import Lightbox from "./Lightbox";

const ImageUploader = ({ setDeliveryPhotos, deliveryPhotos = [] }) => {
    const [previewImages, setPreviewImages] = useState([]);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isConverting, setIsConverting] = useState(false);
    const fileInputRef = useRef(null);

    const convertHeicToJpeg = async (file) => {
        if (file.type === 'image/heic' || file.type === 'image/heif') {
            setIsConverting(true);
            try {
                // Dynamically import heic2any
                const heic2any = (await import('heic2any')).default;
                
                const convertedBlob = await heic2any({
                    blob: file,
                    toType: 'image/jpeg',
                    quality: 0.8
                });

                // Create a new file from the converted blob
                const convertedFile = new File(
                    [convertedBlob],
                    file.name.replace(/\.(heic|HEIC|heif|HEIF)$/, '.jpg'),
                    { type: 'image/jpeg' }
                );

                return convertedFile;
            } catch (error) {
                console.error('HEIC conversion error:', error);
                throw new Error('Failed to convert HEIC image');
            } finally {
                setIsConverting(false);
            }
        }
        return file;
    };

    async function handleChange(e) {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files);
            const convertedFiles = [];
            const newPreviewUrls = [];
            
            try {
                for (const file of newFiles) {
                    // Convert HEIC files to JPEG
                    const processedFile = await convertHeicToJpeg(file);
                    convertedFiles.push(processedFile);
                    
                    // Create preview URL
                    const previewUrl = URL.createObjectURL(processedFile);
                    newPreviewUrls.push(previewUrl);
                }
                
                // Update preview images
                setPreviewImages(prev => [...prev, ...newPreviewUrls]);
                
                // Pass the converted files to parent
                setDeliveryPhotos(prev => [...prev, ...convertedFiles]);
            } catch (error) {
                console.error('Error processing images:', error);
                alert('Error processing one or more images. Please try again.');
            }
        }
    }

    const removeImage = (index) => {
        // Revoke the URL to prevent memory leaks
        URL.revokeObjectURL(previewImages[index]);
        
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setDeliveryPhotos(prev => prev.filter((_, i) => i !== index));
    };

    React.useEffect(() => {
        if (deliveryPhotos.length === 0) {
            // Cleanup preview URLs
            previewImages.forEach(url => URL.revokeObjectURL(url));
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
                accept="image/*,.heic,.HEIC,.heif,.HEIF"
                multiple
            />
            {isConverting && (
                <div className="text-blue-600">
                    Converting HEIC image... Please wait...
                </div>
            )}
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

export default ImageUploader;