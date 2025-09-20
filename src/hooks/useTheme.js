import { useState, useEffect } from 'react';

export const useTheme = () => {
    const [theme, setTheme] = useState('dark'); // Default to dark theme

    useEffect(() => {
        const root = window.document.documentElement;
        const newTheme = theme;
        const oldTheme = theme === 'dark' ? 'light' : 'dark';
        
        root.classList.remove(oldTheme);
        root.classList.add(newTheme);

    }, [theme]);

    return [theme, setTheme];
};
