export type reactNodeChildrenType = {
    children: React.ReactNode;
}

export type defaultThemeType = {
    colors: themeType;
    setScheme: (scheme: string) => void;
}

export type themeType = {
    Background: string,
    Card: string,
    PrimaryText: string,
    SecondoryText: string,
    Border: string,
    ButtonText: string,
};

export type primaryType = {
    Primary: string,
    Accent: string,
    Error: string,
    Info: string,
}

export type userType = {
    id: number
    name: String;
    email: String;
    password: String;
}

export type userStoreType = {
    user: userType | null;
    setUser: (user: userType) => void;
    loadUser: () => void;
    removeUser: () => void;
    editUser: (user: userType) => void
}

export type signInInputType = {
    email: string;
    password: string
}

export type signUpInputType = {
    name: string
    email: string;
    password: string
}

export type usersStoreType = {
    users: userType[];
    adduser: (user: userType) => void;
    removeUser: (id: number) => void;
    editUser: (user: userType) => void;
    isInUsers: (email: string) => userType | undefined;
    loadUsers: () => void;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';


export type habitType = {
    name: string;
    description: string;
    repeat:
    { type: 'daily'; days: DayOfWeek[] } |
    { type: 'weekly' } |
    { type: 'monthly' };
    endDate: Date | null;
    goal:
    { type: 'units'; amount: number } |
    {
        type: 'timer'; timePeriod: {
            hours: number;
            minutes: number;
        }
    } |
    null;
    reminder: Date;
} 
