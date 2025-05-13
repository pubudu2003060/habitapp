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
        await AsyncStorage.setItem("@user", JSON.stringify(newHabitList));
    },
    loadHabits:() => {
        
    },
    removeHabit: () => { },
    edithabit: (habit: habitType) => { },
    removeAll: () => { }
}))
