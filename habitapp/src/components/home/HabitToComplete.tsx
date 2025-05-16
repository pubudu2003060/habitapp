import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import { useHabitStore } from '../../store/HabitsStore'
import { habitType } from '../../types/Types'

const HabitToComplete = ({ displayedDay }: { displayedDay: Date }) => {
  const habits = useHabitStore(state => state.habits)
  const periodTypes = ['daily', 'weekly', 'monthly']
  const [timePeriod, setTimePeriod] = useState('daily')
  const [todayHabits, setTodayHabits] = useState<habitType[]>([])

  const getTodayHabits = (habits: habitType[], timePeriod: string) => {
    const filteredHabits = habits.filter((habit) => habit.repeat.type === timePeriod)
    setTodayHabits(filteredHabits)
  }

  useEffect(() => {
    getTodayHabits(habits, timePeriod)
  }, [habits, timePeriod, displayedDay])

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Habits to Complete</Text>

      <View>
        {periodTypes.map((period, i) => (
          <TouchableOpacity key={i} onPress={() => setTimePeriod(period)}>
            <Text>{period}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={todayHabits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 16 }}>{item.name}</Text>
            <Text style={{ fontSize: 16 }}>{item.repeat.type}</Text>
          </View>
        )}
      />
    </View>
  )
}

export default HabitToComplete
