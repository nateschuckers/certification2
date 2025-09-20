import { useState, useEffect } from 'react';

const useTheme = () => {
    const [theme, setTheme] = useState('dark');
    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove(theme === 'dark' ? 'light' : 'dark');
        root.classList.add(theme);
    }, [theme]);
    return [theme, setTheme];
};

export default useTheme;
```

### Next Steps

1.  **Update the File:** Save these changes to your local `src/hooks/useTheme.js` file.
2.  **Push the Change:** In your terminal, please push this final fix to your `refactor` branch on GitHub.
    ```bash
    git add src/hooks/useTheme.js
    ```
    ```bash
    git commit -m "Fix: Correct export for useTheme hook"
    ```
    ```bash
    git push origin refactor
    

