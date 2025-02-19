export const isBrowser = typeof window !== 'undefined';

export const scrollToElement = (element: HTMLElement | null, offset: number = 0) => {
    if (!isBrowser || !element) return;
    
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;

    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
};

export const scrollToTop = () => {
    if (!isBrowser) return;
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
};

export const getElementById = (id: string): HTMLElement | null => {
    if (!isBrowser) return null;
    return document.getElementById(id);
}; 