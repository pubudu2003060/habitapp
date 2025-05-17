import { create } from "zustand";
import { completingHabitType, habitCompletionStoreType, habitType } from "../types/Types";
import { useHabitStore } from "./HabitsStore";

export const useHabitCompletionStore = create<habitCompletionStoreType>((set) => ({
    habits: [],
    loadHabits: async () => {
        try {
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
        } catch (error) {

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
}))

