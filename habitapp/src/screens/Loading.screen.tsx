import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const Loading = ({ navigation }: any) => {

  useFocusEffect(() => {
    setInterval(() => {
      navigation.navigate("SignIn")
    }, 3000)
  })

  return (
    <SafeAreaView>
      <Text>loading</Text>
    </SafeAreaView>
  )
}

export default Loading
