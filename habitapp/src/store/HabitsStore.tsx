import { create } from "zustand";
import { habitStoreType, habitType } from "../types/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore, { Filter } from '@react-native-firebase/firestore';

export const useHabitStore = create<habitStoreType>((set) => ({
    habits: [],
    addHabit: async (habit: habitType) => {
        try {
            const habits = useHabitStore.getState().habits
            const newHabits = [...habits, habit]
            set(() => ({
                habits: newHabits
            }))
            await AsyncStorage.setItem("@habits", JSON.stringify(newHabits));
            await firestore()
                .collection('habits')
                .doc(habit.id.toString())
                .set(habit)
                .then(() => {
                    console.log('User added!');
                });
        } catch (error) {
            console.log("habit data add error" + error)
        }
    },
    loadHabits: async (userID) => {
        try {
            const cashHabits = await AsyncStorage.getItem("@habits");
            const habitsString = cashHabits ? JSON.parse(cashHabits) : [];
            set(() => ({
                habits: habitsString
            }));
            const snapshot = await firestore()
                .collection('habits')
                .where(Filter("userId", "==", userID))
                .get()
            const remoteHabits = snapshot.docs.map(doc => doc.data() as habitType)
            set(() => ({
                habits: remoteHabits
            }))
            await AsyncStorage.setItem("@habits", JSON.stringify(remoteHabits));
        } catch (error) {
            console.error('Error loading habits:', error);
        }

    },
    removeHabit: async (id: number) => {
        const habits = useHabitStore.getState().habits
        const filtered = [...habits].filter(h => h.id !== id)
        set((state) => ({
            habits: filtered
        }))
        await AsyncStorage.setItem("@habits", JSON.stringify(filtered));
        await firestore().collection('habits').doc(id.toString()).delete()
    },
    editHabit: async (updatedHabit: habitType) => {
        const habits = useHabitStore.getState().habits
        const updated = habits.map(h => h.id === updatedHabit.id ? updatedHabit : h);
        set((state) => ({
            habits: updated
        }))
        await AsyncStorage.setItem("@habits", JSON.stringify(updated));
        await firestore().collection('habits').doc(updatedHabit.id.toString()).update(updatedHabit)
    },
    removeAll: async () => {
        await AsyncStorage.removeItem("@habits");
        set((state) => ({
            habits: []
        }))
    }
}))
