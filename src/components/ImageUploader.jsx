// ImageUploader.jsx
import React, { useState, useRef } from "react";
import { X, Upload } from "lucide-react";
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
                const heic2any = (await import('heic2any')).default;
                
                const convertedBlob = await heic2any({
                    blob: file,
                    toType: 'image/jpeg',
                    quality: 0.8
                });

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
                    const processedFile = await convertHeicToJpeg(file);
                    convertedFiles.push(processedFile);
                    const previewUrl = URL.createObjectURL(processedFile);
                    newPreviewUrls.push(previewUrl);
                }
                
                setPreviewImages(prev => [...prev, ...newPreviewUrls]);
                setDeliveryPhotos(prev => [...prev, ...convertedFiles]);
            } catch (error) {
                console.error('Error processing images:', error);
                alert('Error processing one or more images. Please try again.');
            }
        }
    }

    const removeImage = (index) => {
        URL.revokeObjectURL(previewImages[index]);
        setPreviewImages(prev => prev.filter((_, i) => i !== index));
        setDeliveryPhotos(prev => prev.filter((_, i) => i !== index));
    };

    React.useEffect(() => {
        if (deliveryPhotos.length === 0) {
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

    const triggerFileInput = (e) => {
        e.preventDefault(); // Prevent form submission
        e.stopPropagation(); // Stop event bubbling
        fileInputRef.current?.click();
    };
 
    return (
        <div className="space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
                <input 
                    ref={fileInputRef}
                    type="file" 
                    className="hidden"
                    onChange={handleChange}
                    accept="image/*,.heic,.HEIC,.heif,.HEIF"
                    multiple
                />
                <div 
                    onClick={triggerFileInput}
                    className="flex items-center justify-center gap-2 w-full max-w-xs px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors cursor-pointer"
                >
                    <Upload size={20} />
                    <span>Upload Images</span>
                </div>
            </div>
            
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
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
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