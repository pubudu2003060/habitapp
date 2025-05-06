import React, { createContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './Theme.tsx';

export const ThemeContext = createContext<defaultThemeType>({
    colors: lightTheme,
    setScheme: (scheme: string) => { },
});

import { defaultThemeType, reactNodeChildrenType } from '../types/Types.tsx';

export const ThemeProvider = ({ children }: reactNodeChildrenType) => {

    const deviceColorScheme = useColorScheme();
    const [isDark, setIsDark] = useState<boolean>(deviceColorScheme === 'dark');

    useEffect(() => {
        setIsDark(deviceColorScheme === 'dark');
    }, [deviceColorScheme]);

    const defaultTheme: defaultThemeType = {
        colors: isDark ? darkTheme : lightTheme,
        setScheme: (scheme: string) => setIsDark(scheme === 'dark'),
    };

    return (
        <ThemeContext.Provider value={defaultTheme}>
            {children}
        </ThemeContext.Provider>
    );
};