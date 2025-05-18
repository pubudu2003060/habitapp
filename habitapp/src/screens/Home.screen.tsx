import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import ShortStatus from '../components/home/ShortStatus';
import useColorStore from '../store/ColorStore';
import HabitToComplete from '../components/home/HabitToComplete';
import CompletedHabit from '../components/home/CompletedHabit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isTimeToReset, useHabitCompletionStore } from '../store/HabitCompletionStore';

const Home = () => {

  useEffect(() => {
    const reset = async () => {
      const lastResetData = await AsyncStorage.getItem("@lastReset");
      const lastReset = lastResetData ? JSON.parse(lastResetData) : {};

      const checkAndReset = async (period: 'daily' | 'weekly' | 'monthly') => {
        const last = lastReset[period] ? new Date(lastReset[period]) : new Date(0);
        if (isTimeToReset(period, last)) {
          await useHabitCompletionStore.getState().resetCompletionHabits(period);
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

  const currentTheme = useColorStore(state => state.currentTheme);

  return (
    <SafeAreaView style={{ backgroundColor: currentTheme.Background, flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <ShortStatus />
        <HabitToComplete />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
  }
})

export default Home
