import { create } from "zustand";
import { completedTaskType, habitStoreType, habitType, lastDateType } from "../types/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore, { Filter } from '@react-native-firebase/firestore';
import { useUserStore } from "./UserStore";
import { useCompletedTasksStore } from "./CompletedTaskStore";

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

            let wasCompleted = false;

            if (updatedHabit.goal && updatedHabit.progress) {
                if (updatedHabit.goal.type === 'units' && updatedHabit.progress.type === 'units') {
                    if (updatedHabit.progress.completedAmount == updatedHabit.goal.amount) {
                        updatedHabit.completeStatus = 'completed';
                        updatedHabit.lastCompletedDate = new Date();
                        wasCompleted = true;
                    }
                } else if (updatedHabit.goal.type === 'timer' && updatedHabit.progress.type === 'timer') {
                    const goalMinutes = updatedHabit.goal.timePeriod.hours * 60 + updatedHabit.goal.timePeriod.minutes;
                    const progressMinutes = updatedHabit.progress.completedTimePeriod.hours * 60 +
                        updatedHabit.progress.completedTimePeriod.minutes;

                    if (progressMinutes == goalMinutes) {
                        updatedHabit.completeStatus = 'completed';
                        updatedHabit.lastCompletedDate = new Date();
                        wasCompleted = true;
                    }
                }
            } else {
                updatedHabit.completeStatus = 'completed';
                updatedHabit.lastCompletedDate = new Date();
                wasCompleted = true;
            }

            if (wasCompleted && updatedHabit.lastCompletedDate) {
                const completedTask: completedTaskType = {
                    id: updatedHabit.id,
                    userId: updatedHabit.userId,
                    name: updatedHabit.name,
                    description: updatedHabit.description,
                    completedDate: updatedHabit.lastCompletedDate,
                    progress: updatedHabit.progress,
                    goal: updatedHabit.goal,
                    repeat: updatedHabit.repeat,
                    completedAt: new Date()
                };

                await useCompletedTasksStore.getState().addCompletedTask(completedTask);
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
    },
    finishHabit: async (id: number) => {
        try {
            const habits = useHabitStore.getState().habits;
            const updatedHabits = habits.map(habit =>
                habit.id === id
                    ? { ...habit, habitStatus: 'finished' as const }
                    : habit
            );

            set(() => ({
                habits: updatedHabits
            }));

            await AsyncStorage.setItem("@habits", JSON.stringify(updatedHabits));

            // await firestore()
            //     .collection('habits')
            //     .doc(id.toString())
            //     .update({ habitStatus: 'finished' });

            console.log(`Habit ${id} marked as finished`);
        } catch (error) {
            console.error("Error finishing habit:", error);
        }
    },
    deleteHabit: async (id: number) => {
        try {
            const habits = useHabitStore.getState().habits;
            const updatedHabits = habits.map(habit =>
                habit.id === id
                    ? { ...habit, habitStatus: 'deleted' as const }
                    : habit
            );

            set(() => ({
                habits: updatedHabits
            }));

            await AsyncStorage.setItem("@habits", JSON.stringify(updatedHabits));

            // await firestore()
            //     .collection('habits')
            //     .doc(id.toString())
            //     .update({ habitStatus: 'deleted' });

            console.log(`Habit ${id} marked as deleted`);
        } catch (error) {
            console.error("Error deleting habit:", error);
        }
    },
    checkAndFinishExpiredHabits: async () => {
        try {
            const habits = useHabitStore.getState().habits;
            const currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0);

            let hasUpdates = false;
            const updatedHabits = habits.map(habit => {
                if (habit.endDate && habit.habitStatus === 'current') {
                    const endDate = new Date(habit.endDate);
                    endDate.setHours(0, 0, 0, 0);

                    if (currentDate >= endDate) {
                        hasUpdates = true;
                        return { ...habit, habitStatus: 'finished' as const };
                    }
                }
                return habit;
            });

            if (hasUpdates) {
                set(() => ({
                    habits: updatedHabits
                }));

                await AsyncStorage.setItem("@habits", JSON.stringify(updatedHabits));

                // Batch update finished habits in Firestore
                // const batch = firestore().batch();
                // updatedHabits.forEach(habit => {
                //     if (habit.habitStatus === 'finished' && habits.find(h => h.id === habit.id)?.habitStatus === 'current') {
                //         const habitRef = firestore().collection('habits').doc(habit.id.toString());
                //         batch.update(habitRef, { habitStatus: 'finished' });
                //     }
                // });
                // await batch.commit();

                console.log('Expired habits marked as finished');
            }
        } catch (error) {
            console.error("Error checking expired habits:", error);
        }
    },
    cleanupDeletedHabits: async () => {
        try {
            const habits = useHabitStore.getState().habits;
            const activeHabits = habits.filter(habit => habit.habitStatus !== 'deleted');
            const deletedHabits = habits.filter(habit => habit.habitStatus === 'deleted');

            if (deletedHabits.length > 0) {
                set(() => ({
                    habits: activeHabits
                }));

                await AsyncStorage.setItem("@habits", JSON.stringify(activeHabits));

                // Delete from Firestore
                // const batch = firestore().batch();
                // deletedHabits.forEach(habit => {
                //     const habitRef = firestore().collection('habits').doc(habit.id.toString());
                //     batch.delete(habitRef);
                // });
                // await batch.commit();

                console.log(`Cleaned up ${deletedHabits.length} deleted habits`);
            }
        } catch (error) {
            console.error("Error cleaning up deleted habits:", error);
        }
    },
    performMonthlyCleanup: async () => {
        try {
            const lastCleanupData = await AsyncStorage.getItem("@lastCleanup");
            const lastCleanup = lastCleanupData ? new Date(JSON.parse(lastCleanupData)) : new Date(0);
            const currentDate = new Date();

            if (currentDate.getDate() === 1 &&
                (lastCleanup.getMonth() !== currentDate.getMonth() ||
                    lastCleanup.getFullYear() !== currentDate.getFullYear())) {

                await useHabitStore.getState().cleanupDeletedHabits();
                await AsyncStorage.setItem("@lastCleanup", JSON.stringify(currentDate.toISOString()));
                console.log('Monthly cleanup performed');
            }
        } catch (error) {
            console.error("Error performing monthly cleanup:", error);
        }
    }
}))
