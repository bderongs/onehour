import { browserStorage } from './storage';
import { createAndAppendScript } from './dom';
import { isBrowser } from './browser';

export const shouldExcludeAnalytics = () => {
    return browserStorage.get('exclude-analytics') === 'true';
};

export const initializeGoatCounter = () => {
    if (!isBrowser) return;
    
    if (shouldExcludeAnalytics()) {
        return; // Don't load the script if excluded
    }

    createAndAppendScript('//gc.zgo.at/count.js', {
        'data-goatcounter': 'https://sparkier.goatcounter.com/count',
        'async': 'true'
    });
}; 