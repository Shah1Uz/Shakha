import React from 'react';

interface IconProps {
  className?: string;
}

export const LogoIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2C11.5 8 8 11.5 2 12C8 12.5 11.5 16 12 22C12.5 16 16 12.5 22 12C16 11.5 12.5 8 12 2Z" />
  </svg>
);

export const GenerateIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

export const EditIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

export const ImageIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
      <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
    </svg>
);

export const MagicWandIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.475 2.118 7.5 7.5 0 0 0 1.056-5.218 5.25 5.25 0 0 0-1.026-3.873 3.75 3.75 0 0 1 .522-5.736 3.75 3.75 0 0 1 5.736.522 5.25 5.25 0 0 0 3.873 1.026 7.5 7.5 0 0 0 5.218-1.056 2.25 2.25 0 0 1-2.118 2.475 3 3 0 0 0-1.128 5.78z" />
    </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
    </svg>
);

export const RemoveBgIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 16.5a1.5 1.5 0 0 0-1.01-1.433 6.002 6.002 0 0 0-11.73 0 1.5 1.5 0 0 0-1.01 1.433v1.875C4.625 20.08 7.917 21 12 21s7.375-.92 7.375-2.625v-1.875Z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeDasharray="2 2" d="M19.5 12c0 4.142-3.358 7.5-7.5 7.5s-7.5-3.358-7.5-7.5 3.358-7.5 7.5-7.5 7.5 3.358 7.5 7.5Z" />
    </svg>
);

export const UpscaleIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75v4.5m0-4.5h-4.5m4.5 0L15 9m5.25 11.25v-4.5m0 4.5h-4.5m4.5 0L15 15" />
    </svg>
);

export const ColorPaletteIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402a3.75 3.75 0 0 0-5.304-5.304L4.098 14.598a3.75 3.75 0 0 0 0 5.304Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 19.5h.008v.008h-.008V19.5Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M14.625 14.625h.008v.008h-.008v-.008Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.625h.008v.008h-.008v-.008Z" /><path strokeLinecap="round" strokeLinejoin="round" d="M14.625 19.5h.008v.008h-.008v-.008Z" />
    </svg>
);

export const LightbulbIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.311a7.5 7.5 0 0 1-7.5 0c.407-1.134.8-2.31 1.14-3.511m6.09-2.042a.75.75 0 0 0-1.21-.638c-.28.172-.56.323-.842.465m4.382-3.682a.75.75 0 0 0-1.21-.638l-.28.172m-1.21-.638a.75.75 0 0 1-1.21.638m-3.682 4.382a.75.75 0 0 1-.638 1.21m-2.04-6.09a.75.75 0 0 0-.638-1.21m-3.51-1.14a7.5 7.5 0 0 1 7.5 0" />
    </svg>
);

export const DownloadIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

export const TextIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-5.25 3h9" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12a9 9 0 1 1 18 0 9 9 0 0 1-18 0Z" />
    </svg>
);

const AspectRatioBaseIcon: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {children}
    </svg>
);
export const AspectRatio1x1Icon: React.FC<IconProps> = ({ className }) => <AspectRatioBaseIcon className={className}><rect x="4" y="4" width="16" height="16" rx="2" /></AspectRatioBaseIcon>;
export const AspectRatio16x9Icon: React.FC<IconProps> = ({ className }) => <AspectRatioBaseIcon className={className}><rect x="2" y="6" width="20" height="11.25" rx="2" /></AspectRatioBaseIcon>;
export const AspectRatio9x16Icon: React.FC<IconProps> = ({ className }) => <AspectRatioBaseIcon className={className}><rect x="7" y="2" width="10" height="20" rx="2" /></AspectRatioBaseIcon>;
export const AspectRatio4x3Icon: React.FC<IconProps> = ({ className }) => <AspectRatioBaseIcon className={className}><rect x="3" y="6" width="18" height="13.5" rx="2" /></AspectRatioBaseIcon>;
export const AspectRatio3x4Icon: React.FC<IconProps> = ({ className }) => <AspectRatioBaseIcon className={className}><rect x="6" y="3" width="12" height="18" rx="2" /></AspectRatioBaseIcon>;

export const SliderIcon: React.FC<IconProps> = ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
    </svg>
);
