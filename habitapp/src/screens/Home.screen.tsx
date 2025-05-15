import React, { useEffect, useState } from 'react'
import { FlatList, Text, View } from 'react-native'
import { useUserStore } from '../store/UserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabitStore } from '../store/HabitsStore';
import ShortStatus from '../components/home/ShortStatus';

const Home = () => {

  const user = useUserStore(state => state.user)
  const loadHabits = useHabitStore(state => state.loadHabits)
  const habits = useHabitStore(state => state.habits)

  useEffect(() => {
    if (user) {
      loadHabits(user.id);
    }
  }, [])

  const [today] = useState(new Date())

  return (
    <SafeAreaView>
      <ShortStatus />
      <FlatList
        data={habits}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>-------------------------</Text>
            <Text>{item.id}</Text>
            <Text>{item.userId}</Text>
            <Text>{item.name}</Text>
            <Text>{item.description}</Text>
            <Text>{item.endDate ? item.endDate.toString() : 'No end date'}</Text>
            <Text>
              {item.goal
                ? item.goal.type === 'units'
                  ? `Units: ${item.goal.amount}`
                  : `Timer: ${item.goal.timePeriod.hours}h ${item.goal.timePeriod.minutes}m`
                : 'No goal'}
            </Text>
            <Text>{item.reminder ? item.reminder.toString() : 'No reminder'}</Text>
            <Text>
              {item.repeat.type === 'daily'
                ? `Daily: ${item.repeat.days.join(', ')}`
                : item.repeat.type === 'weekly'
                  ? 'Weekly'
                  : 'Monthly'}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20 }}>No habits found</Text>}

      />
    </SafeAreaView>
  )
}

export default Home
