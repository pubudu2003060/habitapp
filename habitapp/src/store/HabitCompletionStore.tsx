import { create } from "zustand";
import { completingHabitType, habitCompletionStoreType } from "../types/Types";
import { useHabitStore } from "./HabitsStore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore, { Filter } from "@react-native-firebase/firestore";
import { useUserStore } from "./UserStore";

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


export const useHabitCompletionStore = create<habitCompletionStoreType>((set) => ({
    completionHabits: [],
    resetCompletionHabits: async (period) => {
        try {
            const lastResetData = await AsyncStorage.getItem("@lastReset");
            const lastReset = lastResetData ? JSON.parse(lastResetData) : {};
            const user = useUserStore.getState().user


            if (!isTimeToReset(period, new Date(lastReset[period]))) return;

            const allHabits = useHabitStore.getState().habits;
            const filteredHabits = allHabits.filter(h =>
                h.status === 'current' && h.repeat.type === period
            );

            const todayHabits: completingHabitType[] = filteredHabits.map((habit) => ({
                id: habit.id,
                userId: user?.id ? user?.id.toString() : "",
                goal: habit.goal?.type === 'units'
                    ? { type: 'units', completedAmount: 0 }
                    : habit.goal?.type === 'timer'
                        ? { type: 'timer', completedTimePeriod: { hours: 0, minutes: 0 } }
                        : null,
                onDate: new Date(),
                status: 'pending',
            }));

            set(() => ({ completionHabits: todayHabits }));
            await AsyncStorage.setItem("@todayHabits", JSON.stringify(todayHabits));
            await firestore().collection('habitcompletion').where('userId', '==', user?.id).get().then(snapshot => {
                const batch = firestore().batch();
                snapshot.forEach(doc => batch.delete(doc.ref));
                return batch.commit();
            });

            await Promise.all(
                todayHabits.map(habit =>
                    firestore().collection('habitcompletion').doc(habit.id.toString()).set(habit)
                )
            );

            const updatedReset = {
                ...lastReset,
                [period]: new Date().toISOString()
            };
            await AsyncStorage.setItem("@lastReset", JSON.stringify(updatedReset));

        } catch (error) {
            console.log(`Error resetting ${period} habits:`, error);
        }
    }
    ,
    completeCompletionHabit: async (id: number) => {
        try {
            const habits = useHabitCompletionStore.getState().completionHabits
            set((state) => ({
                completionHabits: state.completionHabits.map(habit =>
                    habit.id === id ? { ...habit, status: 'completed' } : habit
                )
            }))
        } catch (error) {

        }
    },
    loadCompletionHabits: async () => {
        try {

            const storedHabits = await AsyncStorage.getItem("@todayHabits");
            const parsedHabits: completingHabitType[] = storedHabits ? JSON.parse(storedHabits) : [];

            set(() => ({
                completionHabits: parsedHabits,
            }));
        } catch (error) {
            console.log("Error loading completion habits:", error);
        }
    },
    reloadCompletionHabits: async () => {
        try {
            const user = useUserStore.getState().user
            const storedHabits = await AsyncStorage.getItem("@todayHabits");
            const parsedHabits: completingHabitType[] = storedHabits ? JSON.parse(storedHabits) : [];
            const allHabits = useHabitStore.getState().habits;
            const filteredHabits = allHabits.filter(h =>
                h.status === 'current'
            );


            const newTodayHabits = filteredHabits.filter(
                habit => !parsedHabits.some(todayHabit => habit.id === todayHabit.id)
            );

            const newHabit: completingHabitType[] = newTodayHabits.map(habit => ({
                id: habit.id,
                userId: user?.id ? user?.id.toString() : "",
                goal: habit.goal?.type === 'units'
                    ? { type: 'units', completedAmount: 0 }
                    : habit.goal?.type === 'timer'
                        ? { type: 'timer', completedTimePeriod: { hours: 0, minutes: 0 } }
                        : null,
                onDate: new Date(),
                status: 'pending',
            }))

            if (newTodayHabits.length > 0) {
                const updatedHabits: completingHabitType[] = [...parsedHabits, ...newHabit];
                set(() => ({
                    completionHabits: updatedHabits,
                }));
                await AsyncStorage.setItem("@todayHabits", JSON.stringify(updatedHabits));
            }

            newHabit.forEach((habit)=>{
                firestore()
                    .collection('habitcompletion')
                    .doc(habit.id.toString())
                    .set(habit);
            })

        } catch (error) {
            console.log("Error reloading completion habits:", error);
        }
    }
}))
