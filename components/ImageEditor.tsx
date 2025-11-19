
import React, { useState, useCallback, ChangeEvent, DragEvent, useEffect, useRef } from 'react';
import { editImage } from '../services/geminiService';
import { fileToDataUrl } from '../utils/fileUtils';
import Spinner from './Spinner';
import { EditIcon, UploadIcon, ImageIcon, RemoveBgIcon, UpscaleIcon, ColorPaletteIcon, DownloadIcon, TextIcon, SliderIcon } from './Icon';
import { useLanguage } from '../contexts/LanguageContext';

const FONTS = [
    'Arial', 'Verdana', 'Georgia', 'Times New Roman', 'Courier New', 'Impact',
    'Sora', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Oswald', 
    'Merriweather', 'Playfair Display', 'Roboto Slab', 
    'Lobster', 'Pacifico', 'Dancing Script', 'Bangers', 'Permanent Marker'
];

const ImageEditor: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useLanguage();
    
    // editedImage holds the currently displayed version (potentially with text)
    const [editedImage, setEditedImage] = useState<string | null>(null);
    // baseEditedImage holds the clean AI output without text overlay
    const [baseEditedImage, setBaseEditedImage] = useState<string | null>(null);

    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [loadingMessage, setLoadingMessage] = useState<string>('');

    // State for text overlay
    const [overlayText, setOverlayText] = useState<string>('');
    const [fontFamily, setFontFamily] = useState<string>('Arial');
    const [textColor, setTextColor] = useState<string>('#FFFFFF');
    const [fontSize, setFontSize] = useState<number>(60);
    const [textPosition, setTextPosition] = useState<string>('bottom-center');
    
    // State for comparison slider
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDraggingSlider, setIsDraggingSlider] = useState(false);
    const sliderContainerRef = useRef<HTMLDivElement>(null);

    const POSITIONS = [
        { id: 'top-left', label: t.pos_top_left }, { id: 'top-center', label: t.pos_top_center }, { id: 'top-right', label: t.pos_top_right },
        { id: 'middle-left', label: t.pos_middle_left }, { id: 'middle-center', label: t.pos_middle_center }, { id: 'middle-right', label: t.pos_middle_right },
        { id: 'bottom-left', label: t.pos_bottom_left }, { id: 'bottom-center', label: t.pos_bottom_center }, { id: 'bottom-right', label: t.pos_bottom_right },
    ];

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval> | undefined;
        if (loading) {
            setLoadingMessage(t.loading_edit[0]);
            intervalId = setInterval(() => {
                setLoadingMessage(prev => {
                    const otherMessages = t.loading_edit.filter(m => m !== prev);
                    return otherMessages[Math.floor(Math.random() * otherMessages.length)];
                });
            }, 2500);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [loading, t.loading_edit]);

    // Auto-set font size based on image width when a new edited image is loaded
    useEffect(() => {
        if (baseEditedImage) {
             const img = new Image();
             img.onload = () => {
                 const autoSize = Math.max(24, Math.floor(img.width / 20));
                 setFontSize(autoSize);
             };
             img.src = baseEditedImage;
        }
    }, [baseEditedImage]);

    const quickActions = [
        { id: 'remove-bg', label: t.qa_remove_bg, prompt: 'Remove the background, leaving only the main subject. The new background should be transparent.', icon: RemoveBgIcon },
        { id: 'upscale', label: t.qa_upscale, prompt: 'Upscale the image to a higher resolution, enhancing details and clarity without changing the content.', icon: UpscaleIcon },
        { id: 'change-color', label: t.qa_color, prompt: 'Change the color of ', icon: ColorPaletteIcon },
    ];
    
    const processFile = async (selectedFile: File) => {
        setFile(selectedFile);
        setEditedImage(null);
        setBaseEditedImage(null);
        setError(null);
        setPrompt('');

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(URL.createObjectURL(selectedFile));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) processFile(selectedFile);
    };
    
    const handleDragEvent = (e: DragEvent<HTMLDivElement>, dragging: boolean) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(dragging);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        handleDragEvent(e, false);
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles && droppedFiles.length > 0) {
            const selectedFile = droppedFiles[0];
            if (selectedFile.type.startsWith('image/')) processFile(selectedFile);
            else setError("Please drop an image file.");
        }
    };

    const handleEdit = useCallback(async (promptOverride?: string) => {
        const currentPrompt = promptOverride || prompt;
        if (!file || !currentPrompt) {
            setError(t.edit_error_upload);
            return;
        }
        setLoading(true);
        setError(null);
        setEditedImage(null);
        setBaseEditedImage(null);

        try {
            const { base64, mimeType } = await fileToDataUrl(file);
            const imageUrl = await editImage(base64, mimeType, currentPrompt);
            setEditedImage(imageUrl);
            setBaseEditedImage(imageUrl); // Store the clean copy
            setSliderPosition(50);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }, [file, prompt, t.edit_error_upload]);

    const handleQuickActionClick = (action: typeof quickActions[0]) => {
        setPrompt(action.prompt);
        handleEdit(action.prompt);
    };
    
    const handleDownload = () => {
        if (!editedImage) return;
        const link = document.createElement('a');
        link.href = editedImage;
        link.download = 'imagine-art-edited.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    // Combined update logic for mouse and touch
    const updateSliderPosition = (clientX: number) => {
        if (!sliderContainerRef.current) return;
        const rect = sliderContainerRef.current.getBoundingClientRect();
        const x = clientX - rect.left;
        let newPosition = (x / rect.width) * 100;
        if (newPosition < 0) newPosition = 0;
        if (newPosition > 100) newPosition = 100;
        setSliderPosition(newPosition);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDraggingSlider) return;
        e.preventDefault();
        updateSliderPosition(e.clientX);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!isDraggingSlider) return;
        // Touch move doesn't always need preventDefault if we use touch-action: none in CSS
        updateSliderPosition(e.touches[0].clientX);
    };

    const handleApplyTextOverlay = useCallback(() => {
        // Use baseEditedImage as the source so we don't draw text on top of text
        if (!baseEditedImage || !overlayText) return;
    
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
    
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            ctx.font = `bold ${fontSize}px ${fontFamily}`;
            ctx.fillStyle = textColor;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.shadowBlur = 4;
    
            let x = 0, y = 0;
            const margin = fontSize; 
    
            if (textPosition.includes('left')) { ctx.textAlign = 'left'; x = margin; } 
            else if (textPosition.includes('center')) { ctx.textAlign = 'center'; x = canvas.width / 2; } 
            else if (textPosition.includes('right')) { ctx.textAlign = 'right'; x = canvas.width - margin; }
    
            if (textPosition.includes('top')) { ctx.textBaseline = 'top'; y = margin; } 
            else if (textPosition.includes('middle')) { ctx.textBaseline = 'middle'; y = canvas.height / 2; } 
            else { ctx.textBaseline = 'bottom'; y = canvas.height - margin; }
    
            ctx.fillText(overlayText, x, y);
            setEditedImage(canvas.toDataURL('image/png'));
        };
        // Always source from the clean base image
        img.src = baseEditedImage;
    }, [baseEditedImage, overlayText, fontFamily, textColor, textPosition, fontSize]);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-1 bg-base-200 rounded-2xl p-6 sm:p-8 flex flex-col space-y-4 shadow-lg">
                <div 
                    onDragEnter={(e) => handleDragEvent(e, true)}
                    onDragLeave={(e) => handleDragEvent(e, false)}
                    onDragOver={(e) => handleDragEvent(e, true)}
                    onDrop={handleDrop}
                    className={`flex justify-center p-6 border-2 border-base-300 border-dashed rounded-xl transition-colors duration-300 ${isDragging ? 'bg-brand-primary/20 border-brand-primary' : ''}`}>
                     <div className="space-y-1 text-center">
                         {previewUrl ? (
                            <div className="relative group">
                                <img src={previewUrl} alt="Preview" className="mx-auto h-24 w-auto rounded-md" />
                                 <label htmlFor="file-upload" className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    {t.edit_change_img}
                                    <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*"/>
                                </label>
                            </div>
                         ) : (
                            <UploadIcon className="mx-auto h-12 w-12 text-base-content-secondary" />
                         )}
                          {!previewUrl && <div className="flex text-sm text-base-content-secondary">
                             <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-semibold text-brand-primary hover:text-brand-secondary focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-base-200 focus-within:ring-brand-primary">
                                 <span>{t.edit_drop_title}</span>
                                 <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*"/>
                             </label>
                             <p className="pl-1">{t.edit_drop_subtitle}</p>
                         </div>}
                         <p className="text-xs text-base-content-secondary">{file ? file.name : t.edit_drop_hint}</p>
                     </div>
                </div>

                <details className="bg-base-300/50 rounded-xl" open={!!file}>
                    <summary className="p-3 font-semibold cursor-pointer select-none">{t.edit_quick_title}</summary>
                    <div className="p-3 pt-0 grid grid-cols-3 gap-2">
                    {quickActions.map(action => {
                        const Icon = action.icon;
                        return (
                            <button key={action.id} onClick={() => handleQuickActionClick(action)} disabled={!file || loading}
                                className="flex flex-col items-center justify-center text-center p-2 bg-base-100 rounded-lg text-xs font-semibold hover:bg-brand-primary/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200">
                                <Icon className="w-5 h-5 mb-1.5" />{action.label}
                            </button>
                        );
                    })}
                    </div>
                </details>

                <div className="animate-fade-in-up">
                    <label htmlFor="edit-prompt" className="block text-sm font-semibold text-base-content-secondary mb-2">
                        {t.edit_custom_label}
                    </label>
                    <textarea id="edit-prompt" value={prompt} onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t.edit_custom_placeholder} disabled={!file}
                        className="w-full h-24 p-3 bg-base-100 border border-base-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition" rows={3}/>
                </div>

                <button onClick={() => handleEdit()} disabled={loading || !prompt || !file}
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-brand-primary/50">
                    {loading ? <Spinner /> : <EditIcon className="w-5 h-5 mr-2" />} {t.edit_btn_edit}
                </button>

                {error && <div className="bg-red-900/50 text-red-300 text-sm p-3 rounded-xl text-center">{error}</div>}

                {!loading && editedImage && (
                    <div className="animate-fade-in-up space-y-4">
                        <details className="bg-base-300/50 rounded-xl">
                            <summary className="p-3 font-semibold cursor-pointer select-none flex items-center"><TextIcon className="w-5 h-5 mr-2"/>{t.tool_text_overlay}</summary>
                            <div className="p-3 pt-0 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="overlay-text" className="block text-xs font-medium text-base-content-secondary mb-1">{t.tool_text_label}</label>
                                        <input id="overlay-text" type="text" value={overlayText} onChange={(e) => setOverlayText(e.target.value)} placeholder={t.tool_text_placeholder} className="w-full p-2 text-sm bg-base-100 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary"/>
                                    </div>
                                    <div className="flex space-x-2">
                                        <div className="flex-grow">
                                            <label htmlFor="font-family" className="block text-xs font-medium text-base-content-secondary mb-1">{t.tool_font_label}</label>
                                            <select id="font-family" value={fontFamily} onChange={(e) => setFontFamily(e.target.value)} className="w-full p-2 text-sm bg-base-100 border border-base-300 rounded-md focus:ring-2 focus:ring-brand-primary">
                                                {FONTS.map(font => <option key={font} value={font}>{font}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="text-color" className="block text-xs font-medium text-base-content-secondary mb-1">{t.tool_color_label}</label>
                                            <input id="text-color" type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="w-12 h-10 p-1 bg-base-100 border border-base-300 rounded-md cursor-pointer"/>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-base-content-secondary mb-1">{t.tool_size_label}</label>
                                    <div className="flex items-center space-x-2">
                                        <input 
                                            type="range" 
                                            min="10" 
                                            max="400" 
                                            value={fontSize} 
                                            onChange={(e) => setFontSize(Number(e.target.value))} 
                                            className="w-full h-2 bg-base-100 rounded-lg appearance-none cursor-pointer accent-brand-primary"
                                        />
                                        <span className="text-xs w-8 text-right font-mono">{fontSize}px</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-base-content-secondary mb-1">{t.tool_pos_label}</label>
                                    <div className="grid grid-cols-3 gap-1">
                                        {POSITIONS.map(pos => (
                                            <button key={pos.id} onClick={() => setTextPosition(pos.id)} title={pos.label} className={`h-8 rounded-md transition-colors ${textPosition === pos.id ? 'bg-brand-primary' : 'bg-base-100 hover:bg-brand-primary/50'}`}></button>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={handleApplyTextOverlay} disabled={!overlayText}
                                    className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-brand-secondary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity">
                                    {t.tool_btn_add_text}
                                </button>
                            </div>
                        </details>
                        
                        <button 
                            onClick={handleDownload}
                            className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-accent hover:opacity-90 transition-all duration-300 shadow-lg hover:shadow-accent/50"
                        >
                            <DownloadIcon className="w-5 h-5 mr-2" />
                            {t.tool_btn_save}
                        </button>
                    </div>
                )}
            </div>
            
            <div className="lg:col-span-2 bg-base-200 rounded-2xl p-4 flex items-center justify-center min-h-[400px] lg:min-h-full shadow-lg relative overflow-hidden">
                {loading && (
                    <div className="text-center">
                        <Spinner size="lg" variant="magic" />
                        <p key={loadingMessage} className="mt-4 font-medium text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary animate-pulse-fast">{loadingMessage}</p>
                    </div>
                )}
                {!loading && editedImage && previewUrl && (
                    <div 
                        ref={sliderContainerRef}
                        
                        // Mouse events
                        onMouseMove={handleMouseMove}
                        onMouseUp={() => setIsDraggingSlider(false)}
                        onMouseLeave={() => setIsDraggingSlider(false)}
                        
                        // Touch events
                        onTouchMove={handleTouchMove}
                        onTouchEnd={() => setIsDraggingSlider(false)}
                        onTouchCancel={() => setIsDraggingSlider(false)}
                        
                        className="relative w-full h-full select-none cursor-ew-resize animate-fade-in-up touch-none"
                    >
                        <div className="w-full h-full flex items-center justify-center bg-base-100/50 rounded-xl overflow-hidden">
                            <img src={previewUrl} alt="Original" className="w-full h-full object-contain" />
                            <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{t.edit_label_original}</div>
                        </div>

                        <div className="absolute top-0 left-0 h-full w-full overflow-hidden" style={{ width: `${sliderPosition}%` }}>
                           <div className="w-full h-full flex items-center justify-center bg-base-100/50 rounded-xl overflow-hidden" style={{ width: sliderContainerRef.current?.offsetWidth }}>
                                <img src={editedImage} alt="Edited" className="w-full h-full object-contain" />
                                <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">{t.edit_label_edited}</div>
                                <button onClick={handleDownload} className="absolute bottom-3 right-3 bg-base-100/70 backdrop-blur-sm p-2 rounded-full text-base-content hover:bg-brand-primary hover:text-white transition-all duration-300"
                                    aria-label={t.gen_download_alt} title={t.gen_download_alt}>
                                    <DownloadIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        
                        <div 
                            className="absolute top-0 h-full w-1 bg-white/50 backdrop-blur-sm shadow-2xl" 
                            style={{ left: `calc(${sliderPosition}% - 2px)` }} 
                            onMouseDown={(e) => {e.preventDefault(); setIsDraggingSlider(true);}}
                            onTouchStart={(e) => {setIsDraggingSlider(true);}}
                        >
                           <div className="absolute top-1/2 -translate-y-1/2 -left-4 h-9 w-9 rounded-full bg-white shadow-lg flex items-center justify-center text-base-300">
                                <SliderIcon className="w-5 h-5" />
                            </div>
                        </div>
                    </div>
                )}
                {!loading && !editedImage && (
                     <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-base-300 rounded-xl">
                        <div className="text-center text-base-content-secondary">
                            <ImageIcon className="mx-auto h-12 w-12" />
                            <p className="mt-2 text-sm">{t.edit_waiting}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageEditor;
