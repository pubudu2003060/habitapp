import { create } from "zustand";
import { habitCompletionStoreType, habitType } from "../types/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore, { Filter } from '@react-native-firebase/firestore';

export const useHabitCompletionStore = create<habitCompletionStoreType>((set) => ({
    habits: [],
    loadHabits: async () => {
        try {

        } catch (error) {

        }
    },
    completeHabit: async (id: number) => {
        try {

        } catch (error) {

        }
    },
}))

