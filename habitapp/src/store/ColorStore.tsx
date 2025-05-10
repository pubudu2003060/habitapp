import { create } from "zustand";
import { darkTheme, lightTheme, primary } from "../theme/Theme";
import { colorStoreType } from "../types/Types";

const useColorStore = create<colorStoreType>((set) => ({
    primaryColors: primary,
    currentTheme: lightTheme,
    setTheme: (theme) => {
        if (theme == 'dark') {
            set(() => ({
                currentTheme: darkTheme
            }))
        }
        else {
            set(() => ({
                currentTheme: lightTheme
            }))
        }
    }
}))

export default useColorStore;