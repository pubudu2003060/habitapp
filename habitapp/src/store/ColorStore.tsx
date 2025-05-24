import { create } from "zustand";
import { darkTheme, lightTheme, primary } from "../theme/Theme";
import { colorStoreType } from "../types/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useColorStore = create<colorStoreType>((set) => ({
    primaryColors: primary,
    currentTheme: lightTheme,
    isDark: false,
    loadTheme: async () => {
        const theme = await AsyncStorage.getItem('theme');
        const finalTheme = theme === 'dark' ? darkTheme : lightTheme;
        const isDark = theme === 'dark';
        set(() => ({
            currentTheme: finalTheme,
            isDark,
        }));
    },
    setTheme: async (theme) => {
        await AsyncStorage.setItem('theme', theme);
        const isDark = theme === 'dark';
        set(() => ({
            currentTheme: isDark ? darkTheme : lightTheme,
            isDark,
        }));
    },
}))

export default useColorStore;