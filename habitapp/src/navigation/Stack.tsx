import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import SignIn from '../screens/SignIn.screen'
import Signup from '../screens/Signup.screen'

const stack = createNativeStackNavigator()

const Stack = () => {
  return (
    <stack.Navigator>
        <stack.Screen 
            name='SignIn' 
            component={SignIn} 
            options={{ headerShown: false }} 
        />
        <stack.Screen 
            name='SignUp' 
            component={Signup} 
            options={{ headerShown: false }} 
        />
    </stack.Navigator>
  )
}

export default Stack
