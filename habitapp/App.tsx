import React, { useEffect, useState } from 'react'
import Navigation from './src/navigation/Navigation'
import { useHabitStore } from './src/store/HabitsStore';
import { lastDateType } from './src/types/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isFirstTime, isTimeToReset } from './src/Services/HabitService';
import useColorStore from './src/store/ColorStore';
import { set } from 'date-fns';
import { useCompletedTasksStore } from './src/store/CompletedTaskStore';
import { useUserStore } from './src/store/UserStore';

const App = () => {

  const resetCompletionHabits = useHabitStore(state => state.resetCompletionHabits)
  const performMonthlyCleanup = useHabitStore(state => state.performMonthlyCleanup);
  const checkAndFinishExpiredHabits = useHabitStore(state => state.checkAndFinishExpiredHabits);
  const loadTheme = useColorStore(state => state.loadTheme)
  isFirstTime()
  const [themeLoaded, setThemeLoaded] = useState(false);

  useEffect(() => {
    const load = async () => {
      loadTheme();
      setThemeLoaded(true);
    };
    load();
  }, [])

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
    <>
      {themeLoaded ? <Navigation /> : null}
    </>
  )
}

export default App
