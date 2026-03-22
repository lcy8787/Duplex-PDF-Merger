/**
 * Validators & Error Handling
 * File and input validation functions
 */

import { CONFIG } from './config.js';
import { getTranslation } from './i18n.js';

/**
 * Validate a PDF file
 * @param {File} file - File to validate
 * @param {string} lang - Language code for error messages
 * @returns {object} { valid: boolean, error?: string }
 */
export function validatePDFFile(file, lang = 'en') {
    if (!file) {
        return { valid: false, error: getTranslation(lang, 'errorNoFiles') };
    }

    // Check file type
    if (file.type !== CONFIG.fileValidation.mimeType) {
        return { valid: false, error: getTranslation(lang, 'errorInvalidPdf') };
    }

    // Check file size
    if (file.size > CONFIG.fileValidation.maxSize) {
        return { valid: false, error: getTranslation(lang, 'errorFileTooLarge') };
    }

    return { valid: true };
}

/**
 * Validate both odd and even PDF files
 * @param {File} oddFile - Odd pages PDF
 * @param {File} evenFile - Even pages PDF
 * @param {string} lang - Language code
 * @returns {object} { valid: boolean, error?: string }
 */
export function validatePdfs(oddFile, evenFile, lang = 'en') {
    const oddValidation = validatePDFFile(oddFile, lang);
    if (!oddValidation.valid) {
        return oddValidation;
    }

    const evenValidation = validatePDFFile(evenFile, lang);
    if (!evenValidation.valid) {
        return evenValidation;
    }

    return { valid: true };
}

/**
 * Validate output filename
 * @param {string} filename - Filename to validate
 * @returns {object} { valid: boolean, sanitized: string }
 */
export function validateOutputFilename(filename) {
    if (!filename || typeof filename !== 'string') {
        return { valid: false, sanitized: '' };
    }

    // Remove invalid characters
    let sanitized = filename.replace(/[<>:"|?*]/g, '_');
    
    // Ensure .pdf extension
    if (!sanitized.toLowerCase().endsWith('.pdf')) {
        sanitized += '.pdf';
    }

    return { valid: true, sanitized };
}

/**
 * Generate default output filename from input files
 * @param {File} oddFile - Odd pages PDF
 * @param {File} evenFile - Even pages PDF
 * @returns {string} Default filename
 */
export function generateDefaultFilename(oddFile, evenFile) {
    let nameA = oddFile ? oddFile.name.replace(/\.[^/.]+$/, '') : 'FileA';
    let nameB = evenFile ? evenFile.name.replace(/\.[^/.]+$/, '') : 'FileB';

    // Sanitize names (remove invalid characters)
    nameA = nameA.replace(/[<>:"|?*]/g, '_');
    nameB = nameB.replace(/[<>:"|?*/]/g, '_');

    return `merged_${nameA}_${nameB}.pdf`;
}

/**
 * Get human-readable file size
 * @param {number} bytes - File size in bytes
 * @returns {string} Human-readable size
 */
export function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default {
    validatePDFFile,
    validatePdfs,
    validateOutputFilename,
    generateDefaultFilename,
    formatFileSize,
};
