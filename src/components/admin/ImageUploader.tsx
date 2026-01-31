import React, { useState, useRef } from 'react';
import { Upload, X, Check, Loader2, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
    onUploadSuccess: (url: string) => void;
    label?: string;
    className?: string;
    hotelId?: string;
    hotelName?: string;
    roomId?: string;
    roomName?: string;
    type?: 'hotel' | 'room';
    multiple?: boolean; // [NEW] Allow multiple file selection
}

const API_BASE_URL = typeof window !== 'undefined'
    ? (window.location.port === '3000' || window.location.port === '5173' ? `${window.location.protocol}//${window.location.hostname}:3001` : '')
    : '';

const ImageUploader: React.FC<ImageUploaderProps> = ({
    onUploadSuccess,
    label = "رفع صورة",
    className = "",
    hotelId,
    hotelName,
    roomId,
    roomName,
    type = 'hotel',
    multiple = false
}) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadSingleFile = async (file: File): Promise<string | null> => {
        if (!file.type.startsWith('image/')) {
            return null;
        }

        const formData = new FormData();
        formData.append('image', file);

        try {
            const params = new URLSearchParams();
            params.append('type', type);
            if (hotelId && hotelId !== 'undefined' && hotelId !== 'null') {
                params.append('hotelId', hotelId);
            }
            if (hotelName) {
                params.append('hotelName', hotelName);
            }
            if (roomId && roomId !== 'undefined' && roomId !== 'null') {
                params.append('roomId', roomId);
            }
            if (roomName) {
                params.append('roomName', roomName);
            }

            const url = `${API_BASE_URL}/api/upload?${params.toString()}`;

            const response = await fetch(url, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('فشل الرفع');

            const data = await response.json();
            return data.url; // Return relative path
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    const handleUpload = async (files: FileList) => {
        const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));

        if (validFiles.length === 0) {
            setError('يرجى اختيار ملفات صور صالحة (JPG, PNG, WebP)');
            return;
        }

        setIsUploading(true);
        setError(null);
        setUploadProgress({ current: 0, total: validFiles.length });

        let successCount = 0;
        let failCount = 0;

        for (let i = 0; i < validFiles.length; i++) {
            setUploadProgress({ current: i + 1, total: validFiles.length });
            const resultUrl = await uploadSingleFile(validFiles[i]);
            if (resultUrl) {
                onUploadSuccess(resultUrl);
                successCount++;
            } else {
                failCount++;
            }
        }

        setIsUploading(false);
        setUploadProgress({ current: 0, total: 0 });

        if (failCount > 0) {
            setError(`فشل رفع ${failCount} من ${validFiles.length} صور`);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleUpload(e.target.files);
        }
        // Reset the input so the same files can be selected again
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const onDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            handleUpload(e.dataTransfer.files);
        }
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {label && <label className="text-[10px] font-black text-slate-400 uppercase mr-2">{label}</label>}

            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`relative h-40 border-2 border-dashed rounded-[2rem] flex flex-col items-center justify-center transition-all cursor-pointer overflow-hidden ${isDragging
                    ? 'border-emerald-500 bg-emerald-50'
                    : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-emerald-200'
                    }`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    className="hidden"
                    accept="image/*"
                    multiple={multiple}
                />

                {isUploading ? (
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-slate-800" size={32} />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            جاري الرفع... {uploadProgress.total > 1 ? `(${uploadProgress.current}/${uploadProgress.total})` : ''}
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 p-6 text-center">
                        <div className={`p-4 rounded-2xl ${isDragging ? 'bg-slate-800 text-white' : 'bg-white text-slate-300'} shadow-sm transition-colors`}>
                            <Upload size={24} />
                        </div>
                        <div>
                            <p className="text-xs font-black text-slate-600">
                                {multiple ? 'اسحب الصور هنا أو اضغط للاختيار (متعدد)' : 'اسحب الصورة هنا أو اضغط للاختيار'}
                            </p>
                            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase tracking-tighter">JPG, PNG, WebP (Max 5MB)</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-x-0 bottom-0 bg-red-500 text-white py-2 px-4 text-[10px] font-black text-center animate-in slide-in-from-bottom-full">
                        {error}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageUploader;
