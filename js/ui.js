/**
 * Enhanced UI Module
 * User interface with preview, drag-drop, and progress tracking
 */
import { getDict, getTranslation } from './i18n.js';
import { generateDefaultFilename, formatFileSize, validateOutputFilename, validatePdfs } from './validators.js';
import { mergePdfs, getPdfPageCount, downloadFile } from './pdfMerger.js';
import { saveMergeHistory } from './storage.js';
import { CONFIG } from './config.js';
import PDFPreview from './pdfPreview.js';

export class UI {
    constructor() {
        this.currentLang = 'zh';
        this.isProcessing = false;
        this.previewOdd = null;
        this.previewEven = null;
        
        // Cache DOM elements
        this.elements = {};
    }

    /**
     * Initialize UI
     */
    init() {
        // Cache DOM elements
        this.cacheElements();

        // Check if basic elements exist
        if (!this.elements.mergeBtn) {
            console.error('UI elements not found');
            return;
        }

        // Attach event listeners
        this.attachEventListeners();
        
        // Initialize previews
        this.initPreviews();
        
        // Update UI
        this.updateUI();
    }

    cacheElements() {
        this.elements = {
            langToggle: document.getElementById('langToggle'),
            oddPdf: document.getElementById('oddPdf'),
            evenPdf: document.getElementById('evenPdf'),
            reverseEven: document.getElementById('reverseEven'),
            evenLabel: document.getElementById('evenLabel'),
            outputFileName: document.getElementById('outputFileName'),
            mergeBtn: document.getElementById('mergeBtn'),
            
            // New elements for previews and advanced features
            previewOddContainer: document.getElementById('previewOddContainer'),
            previewEvenContainer: document.getElementById('previewEvenContainer'),
            progressWrapper: document.getElementById('progressWrapper'),
            progressBar: document.getElementById('progressBar'),
            progressPercent: document.getElementById('progressPercent'),
            

        };
    }

    initPreviews() {
        if (this.elements.previewOddContainer) {
            this.previewOdd = new PDFPreview('previewOddContainer', {
                pdfWorkerUrl: CONFIG.pdfjs.workerUrl
            });
        }
        if (this.elements.previewEvenContainer) {
            this.previewEven = new PDFPreview('previewEvenContainer', {
                pdfWorkerUrl: CONFIG.pdfjs.workerUrl
            });
        }
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Language toggle
        if (this.elements.langToggle) {
            this.elements.langToggle.addEventListener('click', () => this.toggleLanguage());
        }

        // Checkboxes
        if (this.elements.reverseEven) {
            this.elements.reverseEven.addEventListener('change', () => this.updateEvenLabel());
        }

        // File inputs
        if (this.elements.oddPdf) {
            this.elements.oddPdf.addEventListener('change', () => this.handleFileSelect('odd'));
        }
        if (this.elements.evenPdf) {
            this.elements.evenPdf.addEventListener('change', () => this.handleFileSelect('even'));
        }

        // Merge button
        if (this.elements.mergeBtn) {
            this.elements.mergeBtn.addEventListener('click', () => this.handleMergeClick());
        }

        // Drag and drop
        this.setupDragDrop();
    }

    setupDragDrop() {
        ['oddPdf', 'evenPdf'].forEach(fileInputId => {
            const input = document.getElementById(fileInputId);
            if (!input) return;

            const wrapper = input.closest('.file-input-wrapper');
            if (!wrapper) return;

            wrapper.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                wrapper.classList.add('drag-active');
            });

            wrapper.addEventListener('dragleave', (e) => {
                if (e.target === wrapper) {
                    wrapper.classList.remove('drag-active');
                }
            });

            wrapper.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                wrapper.classList.remove('drag-active');

                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    input.files = files;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
        });
    }

    /**
     * Toggle language between Chinese and English
     */
    toggleLanguage() {
        this.currentLang = this.currentLang === 'zh' ? 'en' : 'zh';
        if (this.elements.langToggle) {
            this.elements.langToggle.innerText = this.currentLang === 'zh' ? 'EN' : '中文';
        }
        this.updateUI();
    }

    /**
     * Update all UI text based on current language
     */
    updateUI() {
        const dict = getDict(this.currentLang);
        
        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (dict[key]) {
                el.innerText = dict[key];
            }
        });

        if (this.elements.outputFileName) {
            this.elements.outputFileName.placeholder = dict.outputPlaceholder;
        }

        this.updateEvenLabel();
    }

    /**
     * Update even pages label based on reverse checkbox
     */
    updateEvenLabel() {
        const dict = getDict(this.currentLang);
        if (this.elements.evenLabel && this.elements.reverseEven) {
            this.elements.evenLabel.innerText = this.elements.reverseEven.checked
                ? dict.evenLabelReverse
                : dict.evenLabelNormal;
        }
    }

    /**
     * Update output filename based on selected files
     */
    updateOutputFilename() {
        if (this.elements.outputFileName) {
            const filename = generateDefaultFilename(
                this.elements.oddPdf?.files[0] || null,
                this.elements.evenPdf?.files[0] || null
            );
            this.elements.outputFileName.value = filename;
        }
    }

    async handleFileSelect(type) {
        const input = type === 'odd' ? this.elements.oddPdf : this.elements.evenPdf;
        const preview = type === 'odd' ? this.previewOdd : this.previewEven;

        if (!input || !input.files[0] || !preview) {
            return;
        }

        try {
            // Load and display preview
            await preview.loadPDF(input.files[0]);
        } catch (error) {
            console.error(`Failed to load preview for ${type}:`, error);
        }

        // Update output filename
        this.updateOutputFilename();
    }

    /**
     * Merge PDFs
     */
    async handleMergeClick() {
        const dict = getDict(this.currentLang);

        // Validate files
        if (!this.elements.oddPdf?.files[0] || !this.elements.evenPdf?.files[0]) {
            this.showNotification(dict.errorNoFiles, 'error');
            return;
        }

        // Get and validate output filename
        let outputFilename = (this.elements.outputFileName?.value || '').trim();
        if (!outputFilename) {
            outputFilename = 'merged_document.pdf';
        } else {
            const validation = validateOutputFilename(outputFilename);
            outputFilename = validation.sanitized;
        }

        // Start merge
        this.isProcessing = true;
        this.elements.mergeBtn.disabled = true;
        this.elements.mergeBtn.innerText = dict.btnProcessing;
        this.showProgressBar();

        try {
            this.setProgress(15);

            // Read files
            const oddBytes = await this.elements.oddPdf.files[0].arrayBuffer();
            const evenBytes = await this.elements.evenPdf.files[0].arrayBuffer();
            
            this.setProgress(30);

            // Merge
            const mergedBytes = await mergePdfs(oddBytes, evenBytes, {
                reverseEven: this.elements.reverseEven?.checked ?? true
            });

            this.setProgress(90);

            // Download
            downloadFile(mergedBytes, outputFilename);

            // Save to history
            saveMergeHistory({
                oddFile: this.elements.oddPdf.files[0].name,
                evenFile: this.elements.evenPdf.files[0].name,
                outputFile: outputFilename,
                reverseEven: this.elements.reverseEven?.checked
            });

            this.setProgress(100);
            this.showNotification(dict.successMerged, 'success');
        } catch (error) {
            console.error('Merge error:', error);
            this.showNotification(dict.errorMergeFailed, 'error');
        } finally {
            this.hideProgressBar();
            this.isProcessing = false;
            this.elements.mergeBtn.disabled = false;
            this.elements.mergeBtn.innerText = dict.btnMerge;
        }
    }

    setProgress(percent, status = '') {
        if (this.elements.progressBar) {
            this.elements.progressBar.style.width = percent + '%';
        }
        if (this.elements.progressPercent) {
            this.elements.progressPercent.textContent = Math.round(percent) + '%';
        }
    }

    showProgressBar() {
        if (this.elements.progressWrapper) {
            this.elements.progressWrapper.classList.add('active');
            this.setProgress(0);
        }
    }

    hideProgressBar() {
        if (this.elements.progressWrapper) {
            this.elements.progressWrapper.classList.remove('active');
        }
    }

    /**
     * Show notification/toast message
     * @param {string} message - Message text
     * @param {string} type - Type ('success', 'error', 'warning', 'info')
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const messageDiv = document.createElement('div');
        messageDiv.textContent = message;
        notification.appendChild(messageDiv);

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'notification-close';
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', () => {
            notification.remove();
        });
        notification.appendChild(closeBtn);

        document.body.appendChild(notification);

        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, CONFIG.ui.notificationDuration);
    }
}

export default UI;
