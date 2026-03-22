/**
 * PDF Merger Module
 * Core PDF merging logic using pdf-lib
 */

/**
 * Merge odd and even PDF pages with optional reversal
 * @param {ArrayBuffer} oddPdfBytes - PDF bytes for odd pages
 * @param {ArrayBuffer} evenPdfBytes - PDF bytes for even pages
 * @param {object} options - Merge options
 * @param {boolean} options.reverseEven - Whether to reverse even pages
 * @returns {Promise<Uint8Array>} Merged PDF bytes
 */
export async function mergePdfs(oddPdfBytes, evenPdfBytes, options = {}) {
    const { reverseEven = true } = options;

    if (!window.PDFLib) {
        throw new Error('pdf-lib is not loaded. Please ensure the library is loaded before calling mergePdfs.');
    }

    const { PDFDocument } = window.PDFLib;

    try {
        // Load PDF documents
        const oddDoc = await PDFDocument.load(oddPdfBytes);
        const evenDoc = await PDFDocument.load(evenPdfBytes);

        // Create new merged document
        const mergedDoc = await PDFDocument.create();

        // Get page counts
        const oddCount = oddDoc.getPageCount();
        const evenCount = evenDoc.getPageCount();

        // Prepare page indices
        const oddIndices = Array.from({ length: oddCount }, (_, i) => i);
        let evenIndices = Array.from({ length: evenCount }, (_, i) => i);

        // Reverse even pages if requested
        if (reverseEven) {
            evenIndices.reverse();
        }

        // Copy pages from both documents
        const copiedOddPages = await mergedDoc.copyPages(oddDoc, oddIndices);
        const copiedEvenPages = await mergedDoc.copyPages(evenDoc, evenIndices);

        // Interleave odd and even pages
        const maxLength = Math.max(oddCount, evenCount);
        for (let i = 0; i < maxLength; i++) {
            if (i < oddCount) {
                mergedDoc.addPage(copiedOddPages[i]);
            }
            if (i < evenCount) {
                mergedDoc.addPage(copiedEvenPages[i]);
            }
        }

        // Save and return merged PDF bytes
        const mergedPdfBytes = await mergedDoc.save();
        return mergedPdfBytes;
    } catch (error) {
        console.error('PDF merge error:', error);
        throw new Error(`Failed to merge PDFs: ${error.message}`);
    }
}

/**
 * Get page count from PDF bytes
 * @param {ArrayBuffer} pdfBytes - PDF bytes
 * @returns {Promise<number>} Total page count
 */
export async function getPdfPageCount(pdfBytes) {
    if (!window.PDFLib) {
        throw new Error('pdf-lib is not loaded');
    }

    const { PDFDocument } = window.PDFLib;

    try {
        const doc = await PDFDocument.load(pdfBytes);
        return doc.getPageCount();
    } catch (error) {
        throw new Error(`Failed to read PDF: ${error.message}`);
    }
}

/**
 * Trigger file download from bytes
 * @param {Uint8Array} bytes - File bytes
 * @param {string} filename - Download filename
 */
export function downloadFile(bytes, filename) {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

export default {
    mergePdfs,
    getPdfPageCount,
    downloadFile,
};
