/**
 * Configuration & Constants
 * Global configuration, CDN paths, and constants
 */

export const CONFIG = {
    // pdf-lib configurations
    pdflib: {
        cdnUrl: 'https://unpkg.com/pdf-lib@1.17.1/dist/pdf-lib.min.js',
    },

    // PDF.js configurations (for preview)
    pdfjs: {
        cdnUrl: 'https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.min.js',
        workerUrl: 'https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.min.js',
    },

    // Default file names
    defaultFileNames: {
        zh: {
            fileA: '檔案A',
            fileB: '檔案B',
        },
        en: {
            fileA: 'FileA',
            fileB: 'FileB',
        },
    },

    // Default output filename pattern
    defaultOutputPattern: 'merged_{fileA}_{fileB}.pdf',

    // File validation
    fileValidation: {
        maxSize: 500 * 1024 * 1024, // 500 MB
        mimeType: 'application/pdf',
        acceptedExtensions: ['.pdf'],
    },

    // UI configuration
    ui: {
        notificationDuration: 3000, // milliseconds
        debounceDelay: 300, // milliseconds for input events
    },

    // Storage keys for localStorage
    storage: {
        mergeHistory: 'duplex_merge_history',
        userPreferences: 'duplex_preferences',
    },
};

export default CONFIG;
