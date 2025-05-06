export type reactNodeChildrenType = {
    children: React.ReactNode;
}

export type defaultThemeType = {
    isDark: boolean;
    colors: themeType;
    setScheme: (scheme:string) => void;
}

export type themeType = {
    primary: String,
    accent: String,
    highlight: String,
    neutral: String,
    background: String,
    text: String,
};
