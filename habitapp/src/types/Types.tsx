export type reactNodeChildrenType = {
    children: React.ReactNode;
}

export type defaultThemeType = {
    colors: themeType;
    setScheme: (scheme: string) => void;
}

export type themeType = {
    Background: string;
    Card: string;
    PrimaryText: string;
    SecondoryText: string;
    Border: string;
    ButtonText: string;
};

export type primaryType = {
    Primary: string;
    Accent: string;
    Error: string;
    Info: string;
}

export type colorStoreType = {
    primaryColors: primaryType;
    currentTheme: themeType;
    isDark: boolean,
    loadTheme: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
}

export type userType = {
    id: string;
    name: string;
    email: string;
}

export type userStoreType = {
    user: userType | null;
    signInUser: (user: signInInputType) => Promise<void>;
    signUpUser: (user: signUpInputType) => Promise<void>;
    loadUser: () => Promise<void>;
    signOut: () => Promise<void>;
    editUser: (user: userType) => Promise<void>
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
    id: number,
    userId: string
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
    progress:
    { type: 'units'; completedAmount: number } |
    {
        type: 'timer'; completedTimePeriod: {
            hours: number;
            minutes: number;
        }
    } |
    null;
    reminder: Date;
    setDate: Date;
    lastCompletedDate: Date | undefined;
    completeStatus: 'pending' | 'completed';
    habitStatus: 'current' | 'finished' | 'deleted';
}

export type habitStoreType = {
    habits: habitType[];
    addHabit: (habit: habitType) => Promise<void>;
    loadHabits: (userID: string) => Promise<void>;
    editHabit: (habit: habitType) => Promise<void>;
    removeAll: () => Promise<void>;
    resetCompletionHabits: (period: 'daily' | 'weekly' | 'monthly') => Promise<void>;
    updateProgress: (id: number, newProgress: habitType['progress']) => Promise<habitType | undefined>
    finishHabit: (id: number) => Promise<void>;
    deleteHabit: (id: number) => Promise<void>;
    checkAndFinishExpiredHabits: () => Promise<void>;
    cleanupDeletedHabits: () => Promise<void>;
    performMonthlyCleanup: () => Promise<void>;
}

export type ModelContextType = {
    modalVisible: boolean;
    setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
    modalHabit: habitType | undefined;
    setModalHabit: React.Dispatch<React.SetStateAction<habitType | undefined>>;
};

export type lastDateType = {
    daily: Date;
    weekly: Date;
    monthly: Date;
}

export type completedTaskType = {
    id: number;
    userId: string;
    name: string;
    description: string;
    completedDate: Date;
    progress: habitType['progress'];
    goal: habitType['goal'];
    repeat: habitType['repeat'];
    completedAt: Date;
}

export type completedTasksStoreType = {
    completedTasks: completedTaskType[][];
    addCompletedTask: (task: completedTaskType) => Promise<void>;
    loadCompletedTasks: (userId: string) => Promise<void>;
    getCompletedTasksByDate: (date: Date) => completedTaskType[];
    getCompletedTasksByDateRange: (startDate: Date, endDate: Date) => completedTaskType[][];
    removeCompletedTask: (taskId: number, date: Date) => Promise<void>;
    clearAllCompletedTasks: () => Promise<void>;
    getCompletedTasksStats: (userId: string, period: 'week' | 'month' | 'year') => {
        totalCompleted: number;
        dailyAverage: number;
        mostProductiveDay: { date: Date; count: number } | null;
    };
    removeAll: () => Promise<void>;
}

export type statType = {
    chartData: {
        date: Date;
        completed: number;
    }[];
    maxChartValue: number;
    totalHabits: number;
    completedHabits: number;
    habitStats: {
        id: number;
        name: string;
        progress: number;
        status: string;
        repeat: {
            type: "daily";
            days: DayOfWeek[];
        } | {
            type: "weekly";
        } | {
            type: "monthly";
        }; completedCount: number;
        expectedCount: number;
        description: string;
    }[];
    currentPeriodText: string;
}

export type statBarType = {
    selectedPeriod: 'Day' | 'Week' | 'Month';
    setSelectedPeriod: React.Dispatch<React.SetStateAction<'Day' | 'Week' | 'Month'>>;
    stats: statType;
    currentDate: Date;
    setCurrentDate: React.Dispatch<React.SetStateAction<Date>>;
}

export type AlertButton =  {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
}

export type CustomAlertProps =  {
  visible: boolean;
  title?: string;
  message?: string;
  buttons?: AlertButton[];
  onDismiss?: () => void;
}

export type AlertConfig =  {
  title?: string;
  message?: string;
  buttons?: AlertButton[];
}



