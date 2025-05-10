import { create } from "zustand";
import { darkTheme, lightTheme, primary } from "../theme/Theme";

export const ColorStore = create((set)=>({
    primaryColors:primary,
    lightTheme:lightTheme,
    darkTheme:darkTheme
}))