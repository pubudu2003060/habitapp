import { create } from "zustand";
import { completingHabitType, habitCompletionStoreType, habitType } from "../types/Types";
import { useHabitStore } from "./HabitsStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore, { Filter } from "@react-native-firebase/firestore";
import { useUserStore } from "./UserStore";

export const useHabitCompletionStore = create<habitCompletionStoreType>((set) => ({
    habits: [],
    resetHabits: async () => {
        try {
            await AsyncStorage.removeItem("@todayHabits");
            const habitCompletionSnapshot = await firestore().collection('habitcompletion').get();
            const batch = firestore().batch();
            habitCompletionSnapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();

            const habits = useHabitStore.getState().habits
            const todayhabits = habits
                .filter((habit) => habit.status === 'current')
                .map((habit) => {
                    let newTodayHabit: completingHabitType = {
                        id: habit.id,
                        goal: habit.goal?.type === 'units' ? { type: 'units', completedAmount: 0 } : habit.goal?.type === 'timer' ? { type: "timer", completedTimePeriod: { hours: 0, minutes: 0 } } : null,
                        onDate: new Date(),
                        status: 'pending'
                    };
                    return newTodayHabit;
                })
            set(() => ({
                habits: todayhabits
            }))
            await AsyncStorage.setItem("@todayHabits", JSON.stringify(todayhabits));
            await Promise.all(
                todayhabits.map(async (habit) => {
                    await firestore()
                        .collection('habits')
                        .doc(habit.id.toString())
                        .set(habit)
                })
            );
        } catch (error) {
            console.log("completion habit data reset error" + error)
        }
    },
    completeHabit: async (id: number) => {
        try {
            const habits = useHabitCompletionStore.getState().habits
            set((state) => ({
                habits: state.habits.map(habit =>
                    habit.id === id ? { ...habit, status: 'completed' } : habit
                )
            }))
        } catch (error) {

        }
    },
    loadHabits: async () => {
        try {
            const userId = useUserStore(state => state.user?.id)
            const cashHabits = await AsyncStorage.getItem("@todayHabits");
            const habitsString = cashHabits ? JSON.parse(cashHabits) : [];
            set(() => ({
                habits: habitsString
            }));
            const snapshot = await firestore()
                .collection('habitcompletion')
                .where(Filter("userId", "==", userId))
                .get()
            const remoteHabits = snapshot.docs.map(doc => doc.data() as completingHabitType)
            set(() => ({
                habits: remoteHabits
            }))
            await AsyncStorage.setItem("@todayHabits", JSON.stringify(remoteHabits));
        } catch (error) {

        }
    }
}))
