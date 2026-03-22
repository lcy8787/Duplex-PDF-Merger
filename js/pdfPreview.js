/**
 * PDF Preview Module
 * Handles PDF loading, rendering thumbnails, and page navigation
 */

export class PDFPreview {
    constructor(containerId, options = {}) {
        this.containerId = containerId;
        this.container = document.getElementById(containerId);
        this.pdf = null;
        this.pageCount = 0;
        this.currentPage = 1;
        this.currentScale = options.scale || 1.0;
        this.pdfWorkerUrl = options.pdfWorkerUrl || 'https://unpkg.com/pdfjs-dist@4.0.379/build/pdf.worker.min.js';
        
        // Initialize PDF.js worker
        if (typeof window !== 'undefined' && typeof window.pdfjsWorker === 'undefined') {
            window.pdfjsWorker = true;
            if (window.pdfjsLib) {
                window.pdfjsLib.GlobalWorkerOptions.workerSrc = this.pdfWorkerUrl;
            }
        }
    }

    /**
     * Load PDF from file
     * @param {File} file - PDF file to load
     * @returns {Promise<number>} Total page count
     */
    async loadPDF(file) {
        try {
            if (!window.pdfjsLib) {
                throw new Error('PDF.js library not loaded');
            }

            const arrayBuffer = await file.arrayBuffer();
            const pdfLib = window.pdfjsLib;
            
            this.pdf = await pdfLib.getDocument({ data: arrayBuffer }).promise;
            this.pageCount = this.pdf.numPages;
            this.currentPage = 1;

            // Render first page thumbnail
            await this.renderThumbnail();

            return this.pageCount;
        } catch (error) {
            console.error('Failed to load PDF:', error);
            throw error;
        }
    }

    /**
     * Render current page thumbnail
     */
    async renderThumbnail() {
        if (!this.pdf || this.currentPage < 1 || this.currentPage > this.pageCount) {
            return;
        }

        try {
            const page = await this.pdf.getPage(this.currentPage);
            const viewport = page.getViewport({ scale: this.currentScale });
            
            // Create or reuse canvas
            let canvas = this.container.querySelector('canvas');
            if (!canvas) {
                canvas = document.createElement('canvas');
                canvas.className = 'pdf-canvas';
                this.container.innerHTML = '';
                this.container.appendChild(canvas);
            }

            const context = canvas.getContext('2d');
            canvas.width = viewport.width;
            canvas.height = viewport.height;

            await page.render({
                canvasContext: context,
                viewport: viewport
            }).promise;

            // Update page info
            const pageInfo = this.container.querySelector('.page-info');
            if (pageInfo) {
                pageInfo.textContent = `Page ${this.currentPage} / ${this.pageCount}`;
            }
        } catch (error) {
            console.error('Failed to render thumbnail:', error);
        }
    }

    /**
     * Render all thumbnails grid
     */
    async renderThumbnailsGrid() {
        if (!this.pdf) return;

        try {
            const grid = document.createElement('div');
            grid.className = 'pdf-thumbnails-grid';

            for (let pageNum = 1; pageNum <= Math.min(this.pageCount, 10); pageNum++) {
                const page = await this.pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: 0.5 });

                const canvas = document.createElement('canvas');
                canvas.width = viewport.width;
                canvas.height = viewport.height;
                canvas.className = 'pdf-thumbnail';
                canvas.dataset.page = pageNum;

                const context = canvas.getContext('2d');
                await page.render({
                    canvasContext: context,
                    viewport: viewport
                }).promise;

                // Click to navigate
                canvas.addEventListener('click', () => {
                    this.goToPage(pageNum);
                });

                grid.appendChild(canvas);
            }

            // Replace or append grid
            const oldGrid = this.container.querySelector('.pdf-thumbnails-grid');
            if (oldGrid) {
                oldGrid.remove();
            }
            this.container.appendChild(grid);
        } catch (error) {
            console.error('Failed to render thumbnails grid:', error);
        }
    }

    /**
     * Navigate to specific page
     * @param {number} pageNum - Page number
     */
    async goToPage(pageNum) {
        if (pageNum < 1 || pageNum > this.pageCount) {
            return;
        }
        this.currentPage = pageNum;
        await this.renderThumbnail();
    }

    /**
     * Get PDF metadata
     * @returns {object} Metadata
     */
    getMetadata() {
        return {
            pageCount: this.pageCount,
            currentPage: this.currentPage
        };
    }

    /**
     * Clear preview
     */
    clear() {
        this.container.innerHTML = '';
        this.pdf = null;
        this.pageCount = 0;
        this.currentPage = 1;
    }
}

export default PDFPreview;
