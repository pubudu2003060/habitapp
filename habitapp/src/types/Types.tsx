export type reactNodeChildrenType = {
    children: React.ReactNode;
}

export type defaultThemeType = {
    colors: themeType;
    setScheme: (scheme: string) => void;
}

export type themeType = {
    primary: String,
    accent: String,
    highlight: String,
    neutral: String,
    background: String,
    text: String,
};

export type userType = {
    id: number
    name: String;
    email: String;
    password: String;
}

export type userStoreType = {
    user: userType | null,
    setUser: (user: userType) => void,
    removeUser: (id: number) => void,
    editUser: (id: number) => void
}

export type signInInputType = {
    email: string;
    password: string
}
