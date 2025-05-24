import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from '@react-native-firebase/firestore';
import { completedTasksStoreType, completedTaskType, habitType } from "../types/Types";

export const useCompletedTasksStore = create<completedTasksStoreType>((set, get) => ({
    completedTasks: [],

    addCompletedTask: async (task: completedTaskType) => {
        try {
            const currentTasks = get().completedTasks;
            const taskDate = new Date(task.completedDate);
            taskDate.setHours(0, 0, 0, 0);

            // Find if we already have an array for this date
            const existingDayIndex = currentTasks.findIndex(dayTasks => {
                if (dayTasks.length === 0) return false;
                const dayDate = new Date(dayTasks[0].completedDate);
                dayDate.setHours(0, 0, 0, 0);
                return dayDate.getTime() === taskDate.getTime();
            });

            let updatedTasks: completedTaskType[][];

            if (existingDayIndex !== -1) {
                // Add to existing day
                updatedTasks = currentTasks.map((dayTasks, index) =>
                    index === existingDayIndex
                        ? [...dayTasks, task]
                        : dayTasks
                );
            } else {
                // Create new day array
                updatedTasks = [...currentTasks, [task]];

                // Sort by date (most recent first)
                updatedTasks.sort((a, b) => {
                    if (a.length === 0 || b.length === 0) return 0;
                    const dateA = new Date(a[0].completedDate);
                    const dateB = new Date(b[0].completedDate);
                    return dateB.getTime() - dateA.getTime();
                });
            }

            set(() => ({
                completedTasks: updatedTasks
            }));

            // Save to AsyncStorage
            await AsyncStorage.setItem("@completedTasks", JSON.stringify(updatedTasks));

            // Save to Firestore
            // await firestore()
            //     .collection('completedTasks')
            //     .doc(task.id.toString())
            //     .set({
            //         ...task,
            //         completedDate: firestore.Timestamp.fromDate(task.completedDate),
            //         completedAt: firestore.Timestamp.fromDate(task.completedAt)
            //     });

        } catch (error) {
            console.error("Error adding completed task:", error);
        }
    },

    loadCompletedTasks: async (userId: string) => {
        try {
            // Load from AsyncStorage first
            const cachedTasks = await AsyncStorage.getItem("@completedTasks");
            const localTasks = cachedTasks ? JSON.parse(cachedTasks) : [];

            set(() => ({
                completedTasks: localTasks
            }));

            // Load from Firestore (commented out for now, uncomment when ready to use)
            // const snapshot = await firestore()
            //     .collection('completedTasks')
            //     .where('userId', '==', userId)
            //     .orderBy('completedDate', 'desc')
            //     .get();

            // const remoteTasks = snapshot.docs.map(doc => {
            //     const data = doc.data();
            //     return {
            //         ...data,
            //         completedDate: data.completedDate.toDate(),
            //         completedAt: data.completedAt.toDate()
            //     } as completedTaskType;
            // });

            // if (remoteTasks.length > 0) {
            //     // Group tasks by date
            //     const groupedTasks: completedTaskType[][] = [];
            //     const dateMap = new Map<string, completedTaskType[]>();

            //     remoteTasks.forEach(task => {
            //         const dateKey = task.completedDate.toDateString();
            //         if (!dateMap.has(dateKey)) {
            //             dateMap.set(dateKey, []);
            //         }
            //         dateMap.get(dateKey)!.push(task);
            //     });

            //     // Convert map to array and sort by date
            //     const sortedDates = Array.from(dateMap.keys()).sort((a, b) => 
            //         new Date(b).getTime() - new Date(a).getTime()
            //     );

            //     sortedDates.forEach(dateKey => {
            //         groupedTasks.push(dateMap.get(dateKey)!);
            //     });

            //     set(() => ({
            //         completedTasks: groupedTasks
            //     }));

            //     await AsyncStorage.setItem("@completedTasks", JSON.stringify(groupedTasks));
            // }

        } catch (error) {
            console.error('Error loading completed tasks:', error);
        }
    },

    getCompletedTasksByDate: (date: Date) => {
        const tasks = get().completedTasks;
        const targetDate = new Date(date);
        targetDate.setHours(0, 0, 0, 0);

        const dayTasks = tasks.find(dayArray => {
            if (dayArray.length === 0) return false;
            const dayDate = new Date(dayArray[0].completedDate);
            dayDate.setHours(0, 0, 0, 0);
            return dayDate.getTime() === targetDate.getTime();
        });

        return dayTasks || [];
    },

    getCompletedTasksByDateRange: (startDate: Date, endDate: Date) => {
        const tasks = get().completedTasks;
        const start = new Date(startDate);
        const end = new Date(endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        return tasks.filter(dayArray => {
            if (dayArray.length === 0) return false;
            const dayDate = new Date(dayArray[0].completedDate);
            return dayDate >= start && dayDate <= end;
        });
    },

    removeCompletedTask: async (taskId: number, date: Date) => {
        try {
            const currentTasks = get().completedTasks;
            const targetDate = new Date(date);
            targetDate.setHours(0, 0, 0, 0);

            const updatedTasks = currentTasks.map(dayTasks => {
                if (dayTasks.length === 0) return dayTasks;

                const dayDate = new Date(dayTasks[0].completedDate);
                dayDate.setHours(0, 0, 0, 0);

                if (dayDate.getTime() === targetDate.getTime()) {
                    return dayTasks.filter(task => task.id !== taskId);
                }
                return dayTasks;
            }).filter(dayTasks => dayTasks.length > 0); // Remove empty day arrays

            set(() => ({
                completedTasks: updatedTasks
            }));

            await AsyncStorage.setItem("@completedTasks", JSON.stringify(updatedTasks));

            // Remove from Firestore
            await firestore()
                .collection('completedTasks')
                .doc(taskId.toString())
                .delete();

        } catch (error) {
            console.error("Error removing completed task:", error);
        }
    },

    clearAllCompletedTasks: async () => {
        try {
            set(() => ({
                completedTasks: []
            }));

            await AsyncStorage.removeItem("@completedTasks");

            // Clear from Firestore (batch delete)
            // const snapshot = await firestore().collection('completedTasks').get();
            // const batch = firestore().batch();
            // snapshot.docs.forEach(doc => batch.delete(doc.ref));
            // await batch.commit();

        } catch (error) {
            console.error("Error clearing completed tasks:", error);
        }
    },

    getCompletedTasksStats: (userId: string, period: 'week' | 'month' | 'year') => {
        const tasks = get().completedTasks;
        const now = new Date();
        let startDate = new Date();

        // Calculate start date based on period
        switch (period) {
            case 'week':
                startDate.setDate(now.getDate() - 7);
                break;
            case 'month':
                startDate.setMonth(now.getMonth() - 1);
                break;
            case 'year':
                startDate.setFullYear(now.getFullYear() - 1);
                break;
        }

        // Filter tasks within the period
        const relevantDays = tasks.filter(dayTasks => {
            if (dayTasks.length === 0) return false;
            const dayDate = new Date(dayTasks[0].completedDate);
            return dayDate >= startDate && dayDate <= now;
        });

        // Calculate stats
        const totalCompleted = relevantDays.reduce((total, dayTasks) => total + dayTasks.length, 0);
        const dailyAverage = relevantDays.length > 0 ? totalCompleted / relevantDays.length : 0;

        // Find most productive day
        let mostProductiveDay: { date: Date; count: number } | null = null;
        relevantDays.forEach(dayTasks => {
            if (dayTasks.length > 0) {
                const count = dayTasks.length;
                if (!mostProductiveDay || count > mostProductiveDay.count) {
                    mostProductiveDay = {
                        date: new Date(dayTasks[0].completedDate),
                        count: count
                    };
                }
            }
        });

        return {
            totalCompleted,
            dailyAverage: Math.round(dailyAverage * 100) / 100,
            mostProductiveDay
        };
    }
}));