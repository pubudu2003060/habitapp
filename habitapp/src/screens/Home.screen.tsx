import React from 'react'
import { Button, Text } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { useuserStore } from '../store/UserStore';
import useUsersStore from '../store/UsersStore';


const Home = () => {

  const remove = useuserStore(state=>state.removeUser)

  const user = useuserStore(state => state.user)
  const users = useUsersStore(state => state.users)

  return (
    <>
      <Text>home</Text>
      <Button title="logout" onPress={remove}></Button>
    <Text>User: {user ? JSON.stringify(user) : 'No user logged in'}</Text>
    <Text>Users: {users.length > 0 ? JSON.stringify(users) : 'No users available'}</Text>
    </>

  )
}

export default Home
