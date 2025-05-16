import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import ShortStatus from '../components/home/ShortStatus';
import useColorStore from '../store/ColorStore';
import HabitToComplete from '../components/home/HabitToComplete';
import CompletedHabit from '../components/home/CompletedHabit';

const Home = () => {

  const currentTheme = useColorStore(state => state.currentTheme);

  const [displayedDay, setDisplayedDay] = useState(new Date())

  const isToday = (date: Date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <SafeAreaView style={{ backgroundColor: currentTheme.Background }}>
      <ScrollView>
        <ShortStatus displayedDay={displayedDay} setDisplayedDay={setDisplayedDay} />
        {
          isToday(displayedDay) ? (
            <HabitToComplete displayedDay={displayedDay} />
          ) : displayedDay <= new Date() ? (
            <CompletedHabit displayedDay={displayedDay} />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={[styles.emptyText, { color: currentTheme.SecondoryText }]}>
                No habits Added Yet
              </Text>
            </View>
          )
        }
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
