import { create } from "zustand";
import { habitStoreType, habitType, lastDateType } from "../types/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore, { Filter } from '@react-native-firebase/firestore';
import { useUserStore } from "./UserStore";

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
            // await firestore()
            //     .collection('habits')
            //     .doc(habit.id.toString())
            //     .set(habit)
            //     .then(() => {
            //         console.log('User added!');
            //     });
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
            // const snapshot = await firestore()
            //     .collection('habits')
            //     .where(Filter("userId", "==", userID))
            //     .get()
            // const remoteHabits = snapshot.docs.map(doc => doc.data() as habitType)
            // if (remoteHabits.length > 0) {
            //     set(() => ({
            //         habits: remoteHabits
            //     }))
            //     await AsyncStorage.setItem("@habits", JSON.stringify(remoteHabits));
            // }
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
    },
    resetCompletionHabits: async (period) => {
        try {

            console.log(period + " reset")

            const lastResetData = await AsyncStorage.getItem("@lastReset");
            const lastReset: lastDateType = lastResetData ? JSON.parse(lastResetData) : {};
            const user = useUserStore.getState().user;

            const allHabits = useHabitStore.getState().habits;

            const newHabitList: habitType[] = allHabits.map(habit =>
                habit.habitStatus === 'current' && habit.repeat.type === period
                    ? {
                        ...habit,
                        progress: habit.goal?.type === 'units'
                            ? { type: "units", completedAmount: 0 }
                            : { type: "timer", completedTimePeriod: { hours: 0, minutes: 0 } },
                        completeStatus: 'pending'
                    }
                    : habit
            )

            set(state => ({
                habits: newHabitList
            }));


            await AsyncStorage.setItem("@habits", JSON.stringify(newHabitList));
            // await firestore().collection('habits')
            //     .where('userId', '==', user?.id)
            //     .where('repeat.type', '==', period)
            //     .get()
            //     .then(snapshot => {
            //         const batch = firestore().batch();
            //         snapshot.forEach(doc => batch.delete(doc.ref));
            //         return batch.commit();
            //     });
            // await Promise.all(
            //     newHabitList.map(habit =>
            //         firestore().collection('habitcompletion').doc(habit.id.toString()).set(habit)
            //     )
            // );

            const updatedReset = {
                ...lastReset,
                [period]: new Date().toISOString()
            };
            await AsyncStorage.setItem("@lastReset", JSON.stringify(updatedReset));

        } catch (error) {
            console.log(`Error resetting ${period} habits:`, error);
        }
    },
    updateProgress: async (id: number, newProgress: habitType['progress']) => {
        try {
            const habits = useHabitStore.getState().habits;
            const habitToUpdate = habits.find(h => h.id === id);

            if (!habitToUpdate) {
                return;
            }

            const updatedHabit: habitType = {
                ...habitToUpdate,
                progress: newProgress
            };

            if (updatedHabit.goal && updatedHabit.progress) {
                if (updatedHabit.goal.type === 'units' && updatedHabit.progress.type === 'units') {
                    if (updatedHabit.progress.completedAmount == updatedHabit.goal.amount) {
                        updatedHabit.completeStatus = 'completed';
                        updatedHabit.lastCompletedDate = new Date();
                    }
                } else if (updatedHabit.goal.type === 'timer' && updatedHabit.progress.type === 'timer') {
                    const goalMinutes = updatedHabit.goal.timePeriod.hours * 60 + updatedHabit.goal.timePeriod.minutes;
                    const progressMinutes = updatedHabit.progress.completedTimePeriod.hours * 60 +
                        updatedHabit.progress.completedTimePeriod.minutes;

                    if (progressMinutes == goalMinutes) {
                        updatedHabit.completeStatus = 'completed';
                        updatedHabit.lastCompletedDate = new Date();
                    }
                }
            } else {
                updatedHabit.completeStatus = 'completed';
                updatedHabit.lastCompletedDate = new Date();
            }

            const updatedHabits = habits.map(h => h.id === id ? updatedHabit : h);
            set(() => ({
                habits: updatedHabits
            }));

            await AsyncStorage.setItem("@habits", JSON.stringify(updatedHabits));

            // await firestore()
            //     .collection('habits')
            //     .doc(id.toString())
            //     .update({
            //         progress: updatedHabit.progress,
            //         completeStatus: updatedHabit.completeStatus,
            //         lastCompletedDate: updatedHabit.lastCompletedDate
            //     });

            return updatedHabit;
        } catch (error) {
            console.error("Error updating habit progress:", error);
        }
    }
}))
