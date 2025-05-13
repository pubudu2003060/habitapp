import React from 'react'
import { Button, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useuserStore } from '../store/UserStore';


const Home = () => {

  const remove = useuserStore(state=>state.removeUser)
  const user = useuserStore(state => state.user)
 

  return (
    <>
      <Text>home</Text>
      <Button title="logout" onPress={remove}></Button>
    <Text>User: {user ? JSON.stringify(user) : 'No user logged in'}</Text>
    </>

  )
}

export default Home
