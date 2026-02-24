import { apiFetch } from './api.js?v=20260224d';

const IMAGE_COMPRESSION_CDN = 'https://cdn.jsdelivr.net/npm/browser-image-compression@2.0.2/+esm';
let imageCompressionLoader = null;

async function loadImageCompression() {
    if (window.imageCompression) return window.imageCompression;
    if (!imageCompressionLoader) {
        imageCompressionLoader = import(IMAGE_COMPRESSION_CDN)
            .then((module) => module.default || module)
            .catch(() => null);
    }
    return imageCompressionLoader;
}

/**
 * Compresses an image file natively in the browser before sending it to the backend.
 * Converts to WebP natively to save bandwidth, maximizing resolution at 1080px.
 * 
 * @param {File} file The uncompressed original File from input accept="image/*"
 * @returns {Promise<{success: boolean, url?: string, key?: string, error?: string}>}
 */
export async function compressAndUpload(file) {
    try {
        const imageCompression = await loadImageCompression();
        // 1. Compress on client (saves bandwidth, faster upload on mobile networks)
        const compressedFile = imageCompression
            ? await imageCompression(file, {
                maxSizeMB: 1,           // Max 1MB after compression
                maxWidthOrHeight: 1080, // Max 1080px dimension (fit for mobile)
                useWebWorker: true,
                fileType: 'image/webp', // Convert uniformly to WebP
            })
            : file;

        // 2. Upload to R2 via Worker
        const formData = new FormData();
        // WebP conversion might preserve original extension in name without renaming. We enforce extension in backend.
        formData.append('file', compressedFile, compressedFile.name);

        // Uses our wrapper to automatically attach Better Auth cookies and headers
        const res = await apiFetch('/api/upload/image', {
            method: 'POST',
            body: formData,
        });

        return res;
    } catch (error) {
        console.error('Compression/Upload Error:', error);
        throw error;
    }
}
