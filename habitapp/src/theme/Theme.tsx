import { primaryType, themeType } from "../types/Types";

export const primary: primaryType = {
    Primary: "#4CAF50", //Calm green for success/progress
    Accent: "#FF9800", //Motivational orange for highlights
    Error: "#F44336", //For failed/missed habits
    Info: "#2196F3", //For neutral or informational UI
}

export const lightTheme: themeType = {
    Background: "#F5F5F5",
    Card: "#FFFFFF",
    PrimaryText: "#212121",
    SecondoryText: "#757575",
    Border: "#E0E0E0",
    ButtonText: "#FFFFFF",
};

export const darkTheme: themeType = {
    Background: "#1E1E1E",
    Card: "#121212",
    PrimaryText: "#FAFAFA",
    SecondoryText: "#BDBDBD",
    Border: "#333333",
    ButtonText: "#FAFAFA",
};

