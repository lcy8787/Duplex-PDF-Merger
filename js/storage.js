/**
 * Storage Module
 * Handle merge history and user preferences
 */

import { CONFIG } from './config.js';

/**
 * Save merge history to localStorage
 */
export function saveMergeHistory(mergeRecord) {
    try {
        let history = JSON.parse(localStorage.getItem(CONFIG.storage.mergeHistory) || '[]');
        
        // Keep only last 20 records
        history.unshift({
            timestamp: new Date().toISOString(),
            ...mergeRecord
        });
        history = history.slice(0, 20);

        localStorage.setItem(CONFIG.storage.mergeHistory, JSON.stringify(history));
    } catch (error) {
        console.error('Failed to save merge history:', error);
    }
}

/**
 * Get merge history from localStorage
 */
export function getMergeHistory() {
    try {
        return JSON.parse(localStorage.getItem(CONFIG.storage.mergeHistory) || '[]');
    } catch (error) {
        console.error('Failed to get merge history:', error);
        return [];
    }
}

/**
 * Save user preferences
 */
export function savePreferences(preferences) {
    try {
        localStorage.setItem(CONFIG.storage.userPreferences, JSON.stringify(preferences));
    } catch (error) {
        console.error('Failed to save preferences:', error);
    }
}

/**
 * Get user preferences
 */
export function getPreferences() {
    try {
        return JSON.parse(localStorage.getItem(CONFIG.storage.userPreferences) || '{}');
    } catch (error) {
        console.error('Failed to get preferences:', error);
        return {};
    }
}

/**
 * Clear history
 */
export function clearHistory() {
    try {
        localStorage.removeItem(CONFIG.storage.mergeHistory);
    } catch (error) {
        console.error('Failed to clear history:', error);
    }
}

export default {
    saveMergeHistory,
    getMergeHistory,
    savePreferences,
    getPreferences,
    clearHistory
};
