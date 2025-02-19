import { isBrowser } from './browser';

export const createAndAppendScript = (
    src: string,
    attributes: Record<string, string> = {}
): HTMLScriptElement | null => {
    if (!isBrowser) return null;
    
    const script = document.createElement('script');
    script.src = src;
    
    Object.entries(attributes).forEach(([key, value]) => {
        script.setAttribute(key, value);
    });
    
    document.body.appendChild(script);
    return script;
};

export const createElement = <K extends keyof HTMLElementTagNameMap>(
    tagName: K
): HTMLElementTagNameMap[K] | null => {
    if (!isBrowser) return null;
    return document.createElement(tagName);
};

export const querySelector = <T extends HTMLElement>(
    selector: string
): T | null => {
    if (!isBrowser) return null;
    return document.querySelector(selector);
}; 