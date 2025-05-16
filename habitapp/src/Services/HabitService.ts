import { DayOfWeek, habitType } from "../types/Types";
import { 
  isSameDay, 
  isWithinInterval, 
  isBefore, 
  isAfter, 
  startOfDay, 
  startOfWeek, 
  startOfMonth,
  endOfWeek,
  endOfMonth,
  format,
  addDays
} from 'date-fns';
import { useCompletionStore } from "../store/HabitCompletionStore";

export class HabitService {
  
  /**
   * Determines if a habit should be shown for a specific day
   */
  static shouldShowHabitForDay(habit: habitType, date: Date): boolean {
    const today = new Date();
    const selectedDate = startOfDay(date);
    
    // Don't show habits that have end dates in the past
    if (habit.endDate && isBefore(habit.endDate, selectedDate)) {
      return false;
    }
    
    // Don't show habits that haven't started yet
    if (isAfter(habit.setDate, selectedDate)) {
      return false;
    }
    
    // For daily habits, check if the day of week is in the repeat.days array
    if (habit.repeat.type === 'daily') {
      const dayName = format(selectedDate, 'EEEE') as DayOfWeek;
      return habit.repeat.days.includes(dayName);
    }
    
    return true;
  }
  
  /**
   * Gets habits that should be shown for a specific date
   */
  static getHabitsForDate(habits: habitType[], date: Date): habitType[] {
    return habits.filter(habit => 
      this.shouldShowHabitForDay(habit, date) && 
      habit.status === 'current'
    );
  }
  
  /**
   * Gets habits that need to be completed for today
   */
  static getTodayHabitsToComplete(habits: habitType[], date: Date): habitType[] {
    const habitsForDate = this.getHabitsForDate(habits, date);
    const completionStore = useCompletionStore.getState();
    
    // Filter out habits that have already been completed for their period
    return habitsForDate.filter(habit => 
      !completionStore.isHabitCompletedForPeriod(habit, date)
    );
  }
  
  /**
   * Gets habits that were completed on a specific date
   */
  static getCompletedHabitsForDate(habits: habitType[], date: Date): habitType[] {
    const habitsForDate = this.getHabitsForDate(habits, date);
    const completions = useCompletionStore.getState().getCompletionsForDate(date);
    const completedHabitIds = completions.map(c => c.id);
    
    return habitsForDate.filter(habit => completedHabitIds.includes(habit.id));
  }
  
  /**
   * Gets the period progress for each habit type
   */
  static getHabitsPeriodProgress(habits: habitType[], date: Date): { 
    daily: number, 
    weekly: number, 
    monthly: number 
  } {
    const completionStore = useCompletionStore.getState();
    const today = startOfDay(new Date());
    
    // Get only current habits
    const activeHabits = habits.filter(h => h.status === 'current');
    
    // Split habits by type
    const dailyHabits = activeHabits.filter(h => h.repeat.type === 'daily');
    const weeklyHabits = activeHabits.filter(h => h.repeat.type === 'weekly');
    const monthlyHabits = activeHabits.filter(h => h.repeat.type === 'monthly');
    
    // Calculate completion percentages
    const calculateAverageProgress = (habitList: habitType[]) => {
      if (habitList.length === 0) return 100; // No habits of this type, so "complete"
      
      const totalProgress = habitList.reduce((sum, habit) => {
        return sum + completionStore.getHabitProgress(habit, today);
      }, 0);
      
      return totalProgress / habitList.length;
    };
    
    return {
      daily: calculateAverageProgress(dailyHabits),
      weekly: calculateAverageProgress(weeklyHabits),
      monthly: calculateAverageProgress(monthlyHabits)
    };
  }
  
  /**
   * Calculates overall habit completion progress
   */
  static getOverallProgress(habits: habitType[], date: Date): {
    percentage: number;
    completed: number;
    total: number;
  } {
    const habitsForToday = this.getHabitsForDate(habits, date);
    const completionStore = useCompletionStore.getState();
    
    let completed = 0;
    
    habitsForToday.forEach(habit => {
      if (completionStore.isHabitCompletedForPeriod(habit, date)) {
        completed++;
      }
    });
    
    const total = habitsForToday.length;
    const percentage = total > 0 ? (completed / total) * 100 : 100;
    
    return {
      percentage,
      completed,
      total
    };
  }
  
  /**
   * Gets the completion object for a habit goal
   */
  static createCompletionForHabit(habit: habitType): { 
    type: 'units', 
    completedAmount: number 
  } | { 
    type: 'timer', 
    completedTimePeriod: { 
      hours: number, 
      minutes: number 
    } 
  } | null {
    if (!habit.goal) return null;
    
    if (habit.goal.type === 'units') {
      return {
        type: 'units',
        completedAmount: habit.goal.amount // Full completion
      };
    } else if (habit.goal.type === 'timer') {
      return {
        type: 'timer',
        completedTimePeriod: {
          hours: habit.goal.timePeriod.hours,
          minutes: habit.goal.timePeriod.minutes
        }
      };
    }
    
    return null;
  }
}