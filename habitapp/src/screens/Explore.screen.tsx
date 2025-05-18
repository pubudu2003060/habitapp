import React from 'react'
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native'
import PagerView from 'react-native-pager-view'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useHabitStore } from '../store/HabitsStore'

const Explore = () => {

  const habits = useHabitStore(state => state.habits)
  const removeHabit = useHabitStore(state => state.removeHabit)

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        {habits.map((habit) => {
          return (
            <View>
              <Text>{habit.name}</Text>
              <Text>{habit.habitStatus}</Text>
              <Button title='remove' onPress={() => { removeHabit(habit.id) }}></Button>
              <Text>----------------</Text>
            </View>
          )
        })}
      </ScrollView>
    </SafeAreaView>


  )
}

const styles = StyleSheet.create({
  pagerView: {
    flex: 1,
    height: 300
  },
});

export default Explore
