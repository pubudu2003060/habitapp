import React, { useEffect } from 'react'
import Navigation from './src/navigation/Navigation'
import { useHabitStore } from './src/store/HabitsStore';
import { lastDateType } from './src/types/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isFirstTime, isTimeToReset } from './src/Services/HabitService';

const App = () => {

  const resetCompletionHabits = useHabitStore(state => state.resetCompletionHabits)
  const performMonthlyCleanup = useHabitStore(state => state.performMonthlyCleanup);
  const checkAndFinishExpiredHabits = useHabitStore(state => state.checkAndFinishExpiredHabits);

  isFirstTime()

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await checkAndFinishExpiredHabits();
        await performMonthlyCleanup();
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
