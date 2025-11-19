
import React, { useState, useCallback, useEffect } from 'react';
import { generateImage } from '../services/geminiService';
import { AspectRatio } from '../types';
import { ASPECT_RATIOS } from '../constants';
import Spinner from './Spinner';
import { MagicWandIcon, ImageIcon, DownloadIcon, AspectRatio1x1Icon, AspectRatio16x9Icon, AspectRatio9x16Icon, AspectRatio4x3Icon, AspectRatio3x4Icon } from './Icon';
import { useLanguage } from '../contexts/LanguageContext';

const AspectRatioIconMap: Record<AspectRatio, React.FC<{className?: string}>> = {
    "1:1": AspectRatio1x1Icon,
    "16:9": AspectRatio16x9Icon,
    "9:16": AspectRatio9x16Icon,
    "4:3": AspectRatio4x3Icon,
    "3:4": AspectRatio3x4Icon,
};

const ImageGenerator: React.FC = () => {
    const [prompt, setPrompt] = useState<string>('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const { t } = useLanguage();

    useEffect(() => {
        let intervalId: ReturnType<typeof setInterval> | undefined;
        if (loading) {
            setLoadingMessage(t.loading_gen[0]);
            intervalId = setInterval(() => {
                setLoadingMessage(prev => {
                    const otherMessages = t.loading_gen.filter(m => m !== prev);
                    return otherMessages[Math.floor(Math.random() * otherMessages.length)];
                });
            }, 2500);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [loading, t.loading_gen]);

    const handleGenerate = useCallback(async () => {
        if (!prompt) {
            setError(t.gen_error_prompt);
            return;
        }
        setLoading(true);
        setError(null);
        setGeneratedImage(null);
        try {
            const imageUrl = await generateImage(prompt, aspectRatio);
            setGeneratedImage(imageUrl);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }, [prompt, aspectRatio, t.gen_error_prompt]);
    
    const handleDownload = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = 'imagine-art-generated.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <div className="lg:col-span-1 bg-base-200 rounded-2xl p-6 sm:p-8 flex flex-col space-y-6 shadow-lg">
                <div>
                    <label htmlFor="prompt" className="block text-sm font-semibold text-base-content-secondary mb-2">
                        {t.gen_label_vision}
                    </label>
                    <textarea
                        id="prompt"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={t.gen_placeholder}
                        className="w-full h-32 p-3 bg-base-100 border border-base-300 rounded-xl focus:ring-2 focus:ring-brand-primary focus:border-brand-primary transition"
                        rows={4}
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-base-content-secondary mb-2">{t.gen_label_ratio}</label>
                    <div className="grid grid-cols-5 gap-2">
                        {ASPECT_RATIOS.map((ratio) => {
                            const Icon = AspectRatioIconMap[ratio];
                            return (
                                <button
                                    key={ratio}
                                    onClick={() => setAspectRatio(ratio)}
                                    className={`p-2 flex flex-col items-center justify-center rounded-xl transition-all duration-200 ${
                                        aspectRatio === ratio
                                            ? 'bg-brand-primary text-white ring-2 ring-offset-2 ring-offset-base-200 ring-brand-primary'
                                            : 'bg-base-300 hover:bg-brand-primary/50'
                                    }`}
                                    aria-pressed={aspectRatio === ratio}
                                    title={`Aspect Ratio ${ratio}`}
                                >
                                    <Icon className="w-6 h-6 mb-1"/>
                                    <span className="text-xs font-mono">{ratio}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <button
                    onClick={handleGenerate}
                    disabled={loading || !prompt}
                    className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-brand-primary/50"
                >
                    {loading ? <Spinner /> : <MagicWandIcon className="w-5 h-5 mr-2" />}
                    {t.gen_btn_generate}
                </button>

                {error && <div className="bg-red-900/50 text-red-300 text-sm p-3 rounded-xl text-center">{error}</div>}
            </div>

            <div className="lg:col-span-2 bg-base-200 rounded-2xl p-4 flex items-center justify-center min-h-[400px] lg:min-h-full shadow-lg relative overflow-hidden">
                {loading && (
                    <div className="text-center">
                        <Spinner size="lg" variant="magic" />
                        <p key={loadingMessage} className="mt-4 font-medium text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary animate-pulse-fast">{loadingMessage}</p>
                    </div>
                )}
                {!loading && generatedImage && (
                    <div className="relative w-full h-full animate-fade-in-up">
                        <img src={generatedImage} alt="Generated art" className="w-full h-full object-contain rounded-xl shadow-lg transition-all duration-500 group-hover:scale-105" />
                        <button
                            onClick={handleDownload}
                            className="absolute bottom-3 right-3 bg-base-100/70 backdrop-blur-sm p-2 rounded-full text-base-content hover:bg-brand-primary hover:text-white transition-all duration-300"
                            aria-label={t.gen_download_alt}
                            title={t.gen_download_alt}
                        >
                            <DownloadIcon className="w-5 h-5" />
                        </button>
                    </div>
                )}
                {!loading && !generatedImage && (
                     <div className="w-full h-full flex items-center justify-center border-2 border-dashed border-base-300 rounded-xl">
                        <div className="text-center text-base-content-secondary">
                            <ImageIcon className="mx-auto h-12 w-12" />
                            <p className="mt-2 text-sm">{t.gen_waiting}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageGenerator;
