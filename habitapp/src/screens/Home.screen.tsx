import React from 'react'
import { Button, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useUserStore } from '../store/UserStore';
import { SafeAreaView } from 'react-native-safe-area-context';


const Home = () => {

  const remove = useUserStore(state => state.removeUser)
  const user = useUserStore(state => state.user)


  return (
    <SafeAreaView>
      <Text>home</Text>
      <Button title="logout" onPress={remove}></Button>
      <Text>User: {user ? JSON.stringify(user) : 'No user logged in'}</Text>
    </SafeAreaView>
  )
}

export default Home
