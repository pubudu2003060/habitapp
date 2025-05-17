import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import ShortStatus from '../components/home/ShortStatus';
import useColorStore from '../store/ColorStore';
import HabitToComplete from '../components/home/HabitToComplete';
import CompletedHabit from '../components/home/CompletedHabit';

const Home = () => {

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
