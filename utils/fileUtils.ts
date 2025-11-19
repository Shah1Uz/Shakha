
export const fileToDataUrl = (file: File): Promise<{ base64: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            const [header, base64] = result.split(',');
            if (!header || !base64) {
                return reject(new Error("Invalid file format."));
            }
            const mimeType = header.match(/:(.*?);/)?.[1] || 'application/octet-stream';
            resolve({ base64, mimeType });
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
};
