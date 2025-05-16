import { create } from "zustand";
import { habitType, habittToCompleteType } from "../types/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore, { Filter } from '@react-native-firebase/firestore';
import { isSameDay, startOfDay, startOfWeek, startOfMonth, isSameWeek, isSameMonth } from 'date-fns';

// Type for the completion store
type CompletionStoreType = {
  completions: habittToCompleteType[];
  
  // Load all completions for a user
  loadCompletions: (userId: string) => Promise<void>;
  
  // Complete a habit (create a new completion record)
  completeHabit: (
    habitId: number, 
    date: Date, 
    goalCompletion: { 
      type: 'units', 
      completedAmount: number 
    } | { 
      type: 'timer', 
      completedTimePeriod: { 
        hours: number, 
        minutes: number 
      } 
    } | null
  ) => Promise<void>;
  
  // Get completions for a specific date
  getCompletionsForDate: (date: Date) => habittToCompleteType[];
  
  // Check if a habit is completed for a specific period (day/week/month)
  isHabitCompletedForPeriod: (habit: habitType, date: Date) => boolean;
  
  // Calculate progress percentage for a habit in the current period
  getHabitProgress: (habit: habitType, date: Date) => number;
};

export const useCompletionStore = create<CompletionStoreType>((set, get) => ({
  completions: [],
  
  loadCompletions: async (userId: string) => {
    try {
      // First try to load from local cache
      const cachedCompletions = await AsyncStorage.getItem(`@completions_${userId}`);
      const parsedCompletions = cachedCompletions ? JSON.parse(cachedCompletions) : [];
      
      // Convert date strings back to Date objects
      const processedCompletions = parsedCompletions.map((completion: any) => ({
        ...completion,
        onDate: new Date(completion.onDate)
      }));
      
      set({ completions: processedCompletions });
      
      // Then load from Firebase
      const snapshot = await firestore()
        .collection('habitCompletions')
        .where(Filter("userId", "==", userId))
        .get();
      
      const remoteCompletions = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          ...data,
          onDate: data.onDate.toDate(), // Convert Firestore timestamp to JS Date
        } as habittToCompleteType;
      });
      
      set({ completions: remoteCompletions });
      await AsyncStorage.setItem(`@completions_${userId}`, JSON.stringify(remoteCompletions));
    } catch (error) {
      console.error('Error loading habit completions:', error);
    }
  },
  
  completeHabit: async (habitId, date, goalCompletion) => {
    try {
      const userId = 'currentUserId'; // This should come from your user store/context
      const completionId = `${habitId}_${date.toISOString()}`;
      
      const newCompletion: habittToCompleteType = {
        id: habitId,
        onDate: startOfDay(date),
        goal: goalCompletion,
      };
      
      // Add to local state
      const currentCompletions = get().completions;
      const updatedCompletions = [
        ...currentCompletions.filter(c => !(c.id === habitId && isSameDay(c.onDate, date))),
        newCompletion
      ];
      
      set({ completions: updatedCompletions });
      
      // Save to AsyncStorage
      await AsyncStorage.setItem(`@completions_${userId}`, JSON.stringify(updatedCompletions));
      
      // Save to Firestore
      await firestore()
        .collection('habitCompletions')
        .doc(completionId)
        .set({
          ...newCompletion,
          userId, // Add userId for filtering
        });
        
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  },
  
  getCompletionsForDate: (date) => {
    const completions = get().completions;
    const targetDate = startOfDay(date);
    
    return completions.filter(completion => isSameDay(completion.onDate, targetDate));
  },
  
  isHabitCompletedForPeriod: (habit, date) => {
    const completions = get().completions;
    const dateToCheck = startOfDay(date);
    
    // Check based on habit repetition type
    if (habit.repeat.type === 'daily') {
      // For daily habits, check if completed on this specific day
      return completions.some(completion => 
        completion.id === habit.id && 
        isSameDay(completion.onDate, dateToCheck)
      );
    } 
    else if (habit.repeat.type === 'weekly') {
      // For weekly habits, check if completed in the same week
      const weekStart = startOfWeek(dateToCheck, { weekStartsOn: 1 }); // Monday as week start
      return completions.some(completion => 
        completion.id === habit.id && 
        isSameWeek(completion.onDate, dateToCheck, { weekStartsOn: 1 })
      );
    }
    else if (habit.repeat.type === 'monthly') {
      // For monthly habits, check if completed in the same month
      return completions.some(completion => 
        completion.id === habit.id && 
        isSameMonth(completion.onDate, dateToCheck)
      );
    }
    
    return false;
  },
  
  getHabitProgress: (habit, date) => {
    const completions = get().completions;
    const targetDate = startOfDay(date);
    
    // Function to filter relevant completions based on habit type
    const getRelevantCompletions = () => {
      if (habit.repeat.type === 'daily') {
        return completions.filter(c => 
          c.id === habit.id && 
          isSameDay(c.onDate, targetDate)
        );
      } else if (habit.repeat.type === 'weekly') {
        return completions.filter(c => 
          c.id === habit.id && 
          isSameWeek(c.onDate, targetDate, { weekStartsOn: 1 })
        );
      } else { // monthly
        return completions.filter(c => 
          c.id === habit.id && 
          isSameMonth(c.onDate, targetDate)
        );
      }
    };
    
    const relevantCompletions = getRelevantCompletions();
    
    // If no completions found for this period, return 0%
    if (relevantCompletions.length === 0) return 0;
    
    // If habit has no specific goal, consider it 100% complete
    if (!habit.goal) return 100;
    
    // Calculate progress based on goal type
    if (habit.goal.type === 'units') {
      // For unit-based goals, sum up the completed amounts
      const totalCompleted = relevantCompletions.reduce((sum, completion) => {
        if (completion.goal?.type === 'units') {
          return sum + completion.goal.completedAmount;
        }
        return sum;
      }, 0);
      
      return Math.min(100, (totalCompleted / habit.goal.amount) * 100);
    } 
    else if (habit.goal.type === 'timer') {
      // For timer-based goals, sum up the completed time in minutes
      const targetMinutes = (habit.goal.timePeriod.hours * 60) + habit.goal.timePeriod.minutes;
      
      const totalMinutesCompleted = relevantCompletions.reduce((sum, completion) => {
        if (completion.goal?.type === 'timer') {
          return sum + (completion.goal.completedTimePeriod.hours * 60) + 
                      completion.goal.completedTimePeriod.minutes;
        }
        return sum;
      }, 0);
      
      return Math.min(100, (totalMinutesCompleted / targetMinutes) * 100);
    }
    
    return 0;
  }
}));