import React, { useEffect } from 'react'
import MyTabs from './src/navigation/BottmBar'
import Navigation from './src/navigation/Navigation'
import { useHabitStore } from './src/store/HabitsStore';
import { lastDateType } from './src/types/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isFirstTime } from './src/Services/HabitService';

export const isTimeToReset = (period: string, lastReset: Date): boolean => {
  const now = new Date();
  if (period === 'daily') {
    return (
      now.getFullYear() > lastReset.getFullYear() &&
      now.getMonth() > lastReset.getMonth() ||
      now.getDate() > lastReset.getDate()
    );
  } else if (period === 'weekly') {
    const toStartOfWeek = (date: Date): Date => {
      const d = new Date(date);
      d.setHours(0, 0, 0, 0);
      d.setDate(d.getDate() - d.getDay());
      return d;
    };
    const lastWeek = toStartOfWeek(new Date(lastReset));
    const thisWeek = toStartOfWeek(new Date(now));
    return thisWeek.getTime() > lastWeek.getTime();
  } else if (period === 'monthly') {
    return (
      now.getFullYear() > lastReset.getFullYear() ||
      now.getMonth() > lastReset.getMonth()
    );
  }
  return false;
};

const App = () => {

  const resetCompletionHabits = useHabitStore(state => state.resetCompletionHabits)
  const { checkAndFinishExpiredHabits, performMonthlyCleanup } = useHabitStore();

  isFirstTime()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkAndFinishExpiredHabits();
        await performMonthlyCleanup();
        console.log('App initialization completed');
      } catch (error) {
        console.error('Error during app initialization:', error);
      }
    };
    initializeApp();
  }, []);

  useEffect(() => {
    const reset = async () => {
      const lastResetData = await AsyncStorage.getItem("@lastReset");
      const lastReset: lastDateType = lastResetData ? JSON.parse(lastResetData) : {};
      console.log(lastReset)
      const checkAndReset = async (period: 'daily' | 'weekly' | 'monthly') => {
        const last = lastReset[period] ? new Date(lastReset[period]) : new Date();
        if (isTimeToReset(period, last)) {
          await resetCompletionHabits(period);
        }
      };
      await Promise.all([
        checkAndReset('daily'),
        checkAndReset('weekly'),
        checkAndReset('monthly'),
      ]);
    }
    reset()
  }, [])


  return (
    <Navigation></Navigation>
  )
}

export default App
