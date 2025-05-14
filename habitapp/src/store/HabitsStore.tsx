import { create } from "zustand";
import { habitStoreType, habitType } from "../types/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useHabitStore = create<habitStoreType>((set) => ({
    habits: [],
    addHabit: async (habit: habitType) => {
        set((state) => ({
            habits: [...state.habits], habit
        }))
        const newHabitList = useHabitStore.getState()
        await AsyncStorage.setItem("@habits", JSON.stringify(newHabitList));
    },
    loadHabits: async () => {
        const habits = await AsyncStorage.getItem("@habits");
        const habitsString = habits ? JSON.parse(habits) : [];
        set(() => ({
            habits: habitsString
        }));
    },
    removeHabit: async () => {

    },
    edithabit: (habit: habitType) => { },
    removeAll: async () => {
        await AsyncStorage.removeItem("@habits");
        set((state) => ({
            habits: []
        }))
    }
}))
