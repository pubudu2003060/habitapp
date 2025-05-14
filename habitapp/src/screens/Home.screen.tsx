import React from 'react'
import { Button, Text } from 'react-native'
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

  useFocusEffect(() => {
    loadHabits()
  })

  return (
    <SafeAreaView>
      <Text>home</Text>
      <Button title="logout" onPress={remove}></Button>
      <Text>{user ? JSON.stringify(user) : 'No user logged in'}</Text>
       <Text>{JSON.stringify(habits)}</Text>
    </SafeAreaView>
  )
}

export default Home
