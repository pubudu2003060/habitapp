import { create } from "zustand";
import { habitStoreType, habitType } from "../types/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useHabitStore = create<habitStoreType>((set) => ({
    habits: [],
    addHabit: async (habit: habitType) => {
        set((state) => ({
            habits: [...state.habits, habit]
        }))
        const newHabitList = useHabitStore.getState().habits
        await AsyncStorage.setItem("@habits", JSON.stringify(newHabitList));
    },
    loadHabits: async () => {
        const habits = await AsyncStorage.getItem("@habits");
        const habitsString = habits ? JSON.parse(habits) : [];
        set(() => ({
            habits: habitsString
        }));
    },
    removeHabit: async (id: number) => {
        set((state) => ({
            habits: state.habits.filter((habit) => habit.id !== id)
        }))
        const newHabitList = useHabitStore.getState().habits;
        await AsyncStorage.setItem("@habits", JSON.stringify(newHabitList));
    },
    editHabit: async (updatedHabit: habitType) => {
        set((state) => ({
            habits: state.habits.map(habit =>
                habit.id === updatedHabit.id ? updatedHabit : habit
            )
        }))
        const newHabitList = useHabitStore.getState().habits;
        await AsyncStorage.setItem("@habits", JSON.stringify(newHabitList));
    },
    removeAll: async () => {
        await AsyncStorage.removeItem("@habits");
        set((state) => ({
            habits: []
        }))
    }
}))
