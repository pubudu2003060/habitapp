import React, { useEffect } from 'react'
import { Button, FlatList, Text, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useUserStore } from '../store/UserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useHabitStore } from '../store/HabitsStore';
import { useFocusEffect } from '@react-navigation/native';


const Home = () => {

  const remove = useUserStore(state => state.removeUser)
  const user = useUserStore(state => state.user)
  const loadHabits = useHabitStore(state => state.loadHabits)
  const habits = useHabitStore(state => state.habits)

  useEffect(() => {
    loadHabits();
  }, [])


  return (
    <SafeAreaView>
      <Text>home</Text>
      <Button title="logout" onPress={remove}></Button>
      <Text>{user ? JSON.stringify(user) : 'No user logged in'}</Text>
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
            <Text>{item.endDate ? item.endDate.toISOString() : 'No end date'}</Text>
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
