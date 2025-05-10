import { create } from "zustand";
import { darkTheme, lightTheme, primary } from "../theme/Theme";
import { colorStoreType } from "../types/Types";

const useColorStore = create<colorStoreType>((set) => ({
    primaryColors: primary,
    currentTheme: lightTheme,
    isDark:false,
    setTheme: (theme) => {
        if (theme == 'dark') {
            set(() => ({
                currentTheme: darkTheme,
                isDark:true
            }))
        }
        else {
            set(() => ({
                currentTheme: lightTheme,
                isDark:false
            }))
        }
    }
}))

export default useColorStore;