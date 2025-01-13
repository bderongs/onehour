export const shouldExcludeAnalytics = () => {
    return localStorage.getItem('exclude-analytics') === 'true';
};

export const initializeGoatCounter = () => {
    if (shouldExcludeAnalytics()) {
        return; // Don't load the script if excluded
    }

    const script = document.createElement('script');
    script.setAttribute('data-goatcounter', 'https://sparkier.goatcounter.com/count');
    script.setAttribute('async', 'true');
    script.src = '//gc.zgo.at/count.js';
    document.body.appendChild(script);
}; 