import { create } from "zustand";
import { habitStoreType, habitType } from "../types/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore, { Filter } from '@react-native-firebase/firestore';

export const isTimeToReset = (period: string, lastReset: Date): boolean => {
    const now = new Date();

    if (period === 'daily') {
        return (
            now.toDateString() !== lastReset.toDateString() &&
            now.getHours() >= 12
        );
    } else if (period === 'weekly') {
        const lastWeek = new Date(lastReset);
        lastWeek.setDate(lastWeek.getDate() - lastWeek.getDay());
        const thisWeek = new Date(now);
        thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
        return thisWeek > lastWeek;
    } else if (period === 'monthly') {
        return (
            now.getMonth() !== lastReset.getMonth() ||
            now.getFullYear() !== lastReset.getFullYear()
        );
    }

    return false;
};

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
            if (remoteHabits.length > 0) {
                set(() => ({
                    habits: remoteHabits
                }))
                await AsyncStorage.setItem("@habits", JSON.stringify(remoteHabits));
            }
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
        // try {
        //     const lastResetData = await AsyncStorage.getItem("@lastReset");
        //     const lastReset = lastResetData ? JSON.parse(lastResetData) : {};
        //     const user = useUserStore.getState().user


        //     if (!isTimeToReset(period, new Date(lastReset[period]))) return;

        //     const allHabits = useHabitStore.getState().habits;
        //     const filteredHabits = allHabits.filter(h =>
        //         h.habitStatus === 'current' && h.repeat.type === period
        //     );

        //     const todayHabits: completingHabitType[] = filteredHabits.map((habit) => ({
        //         id: habit.id,
        //         userId: user?.id ? user?.id.toString() : "",
        //         goal: habit.goal?.type === 'units'
        //             ? { type: 'units', completedAmount: 0 }
        //             : habit.goal?.type === 'timer'
        //                 ? { type: 'timer', completedTimePeriod: { hours: 0, minutes: 0 } }
        //                 : null,
        //         onDate: new Date(),
        //         status: 'pending',
        //     }));

        //     set(() => ({ completionHabits: todayHabits }));
        //     await AsyncStorage.setItem("@todayHabits", JSON.stringify(todayHabits));
        //     await firestore().collection('habitcompletion').where('userId', '==', user?.id).get().then(snapshot => {
        //         const batch = firestore().batch();
        //         snapshot.forEach(doc => batch.delete(doc.ref));
        //         return batch.commit();
        //     });

        //     await Promise.all(
        //         todayHabits.map(habit =>
        //             firestore().collection('habitcompletion').doc(habit.id.toString()).set(habit)
        //         )
        //     );

        //     const updatedReset = {
        //         ...lastReset,
        //         [period]: new Date().toISOString()
        //     };
        //     await AsyncStorage.setItem("@lastReset", JSON.stringify(updatedReset));

        // } catch (error) {
        //     console.log(`Error resetting ${period} habits:`, error);
        // }
    }
    ,
    completeCompletionHabit: async (id: number) => {
        try {
            const habits = useHabitStore.getState().habits
            const updateHabits: habitType[] = habits.map((habit) => habit.id === id ? { ...habit, habitStatus: "finished" } : habit)
            const updated = habits.find(h => h.id === id);
            set(() => ({
                habits: updateHabits
            }))
            await AsyncStorage.setItem('@habits', JSON.stringify(updateHabits));
            if (updated) {
                await firestore().collection('habits').doc(updated.id.toString()).update(updated);
            }
        } catch (error) {

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
                if (updatedHabit.progress.completedAmount >= updatedHabit.goal.amount) {
                    updatedHabit.completeStatus = 'completed';
                    updatedHabit.lastCompletedDate = new Date();
                }
            } else if (updatedHabit.goal.type === 'timer' && updatedHabit.progress.type === 'timer') {
                const goalMinutes = updatedHabit.goal.timePeriod.hours * 60 + updatedHabit.goal.timePeriod.minutes;
                const progressMinutes = updatedHabit.progress.completedTimePeriod.hours * 60 + 
                                    updatedHabit.progress.completedTimePeriod.minutes;
                
                if (progressMinutes >= goalMinutes) {
                    updatedHabit.completeStatus = 'completed';
                    updatedHabit.lastCompletedDate = new Date();
                }
            }
        }
        
        const updatedHabits = habits.map(h => h.id === id ? updatedHabit : h);
        set(() => ({
            habits: updatedHabits
        }));
        
        await AsyncStorage.setItem("@habits", JSON.stringify(updatedHabits));
        
        await firestore()
            .collection('habits')
            .doc(id.toString())
            .update({
                progress: updatedHabit.progress,
                completeStatus: updatedHabit.completeStatus,
                lastCompletedDate: updatedHabit.lastCompletedDate
            });
        
        return updatedHabit;
    } catch (error) {
        console.error("Error updating habit progress:", error);
    }
}
}))
