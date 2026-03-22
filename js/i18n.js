/**
 * Internationalization (i18n)
 * Multi-language support and translation management
 */

export const translations = {
    zh: {
        title: 'PDF 雙面掃描合併工具',
        oddLabel: '📄 檔案 A：奇數頁 (1, 3, 5...)',
        evenLabelNormal: '📄 檔案 B：偶數頁 (2, 4, 6...)',
        evenLabelReverse: '📄 檔案 B：偶數頁 (6, 4, 2...)',
        reverseLabel: '偶數頁為倒序',
        outputLabel: '💾 導出檔案名稱',
        outputPlaceholder: '請輸入導出的檔案名稱',
        btnMerge: '合併並下載',
        btnMerging: '合併中...',
        btnProcessing: '處理中...',
        note: '🔒 離線處理，確保文件隱私安全',
        errorNoFiles: '❌ 請先選擇「奇數頁」與「偶數頁」的 PDF 檔案！',
        errorInvalidPdf: '❌ 上傳的檔案無效或不是 PDF 格式',
        errorFileTooLarge: '❌ 檔案大小超過 500 MB 限制',
        errorMergeFailed: '❌ 合併失敗！請確認上傳的檔案為有效的 PDF 格式',
        successMerged: '✅ 合併成功！開始下載文件...',
        defaultFileA: '檔案A',
        defaultFileB: '檔案B',
    },
    en: {
        title: 'Duplex PDF Merger',
        oddLabel: '📄 File A: Odd Pages (1, 3, 5...)',
        evenLabelNormal: '📄 File B: Even Pages (2, 4, 6...)',
        evenLabelReverse: '📄 File B: Even Pages (6, 4, 2...)',
        reverseLabel: 'Reverse even pages',
        outputLabel: '💾 Export File Name',
        outputPlaceholder: 'Enter export file name',
        btnMerge: 'Merge & Download',
        btnMerging: 'Merging...',
        btnProcessing: 'Processing...',
        note: '🔒 Offline processing, ensuring document privacy',
        errorNoFiles: '❌ Please select both "Odd Pages" and "Even Pages" PDF files!',
        errorInvalidPdf: '❌ Uploaded file is invalid or not in PDF format',
        errorFileTooLarge: '❌ File size exceeds 500 MB limit',
        errorMergeFailed: '❌ Merge failed! Please ensure the uploaded files are valid PDFs',
        successMerged: '✅ Merge successful! Downloading file...',
        defaultFileA: 'FileA',
        defaultFileB: 'FileB',
    },
};

/**
 * Get translation by key
 * @param {string} lang - Language code (e.g., 'zh', 'en')
 * @param {string} key - Translation key
 * @returns {string} Translated text
 */
export function getTranslation(lang, key) {
    if (!translations[lang]) {
        console.warn(`Language '${lang}' not found, fallback to 'en'`);
        return translations['en'][key] || key;
    }
    return translations[lang][key] || translations['en'][key] || key;
}

/**
 * Get all translations for a language
 * @param {string} lang - Language code
 * @returns {object} Translation dictionary
 */
export function getDict(lang) {
    return translations[lang] || translations['en'];
}

export default { translations, getTranslation, getDict };
