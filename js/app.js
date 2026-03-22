/**
 * Application Entry Point
 * Initialize all modules and start the application
 */

import { CONFIG } from './config.js';
import UI from './ui.js';

/**
 * Load external library dynamically
 * @param {string} url - Script URL
 * @returns {Promise<void>}
 */
function loadScript(url) {
    return new Promise((resolve, reject) => {
        // Check if already loaded
        if (window.PDFLib) {
            resolve();
            return;
        }

        const script = document.createElement('script');
        script.src = url;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.head.appendChild(script);
    });
}

/**
 * Initialize the application
 */
async function initApp() {
    try {
        console.log('Initializing Duplex PDF Merger...');

        // Load pdf-lib and pdf.js from CDN
        console.log('Loading PDF libraries...');
        await loadScript(CONFIG.pdflib.cdnUrl);
        console.log('pdf-lib loaded successfully');

        await loadScript(CONFIG.pdfjs.cdnUrl);
        console.log('pdf.js loaded successfully');

        // Initialize UI
        const ui = new UI();
        ui.init();

        console.log('Application initialized successfully');
    } catch (error) {
        console.error('Failed to initialize application:', error);
        const errorMsg = document.createElement('div');
        errorMsg.style.cssText =
            'position: fixed; top: 20px; right: 20px; background: #fed7d7; color: #c53030; padding: 20px; border-radius: 8px; max-width: 300px; z-index: 9999; font-family: sans-serif;';
        errorMsg.innerHTML = `
            <strong style="display: block; margin-bottom: 10px;">Error:</strong>
            <div style="font-size: 14px;">Failed to load required libraries. Please ensure you have internet connection and try refreshing the page.</div>
            <div style="font-size: 12px; margin-top: 10px; color: #742a2a;">${error.message}</div>
        `;
        document.body.appendChild(errorMsg);
    }
}

// Start application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
