import { useFocusEffect } from '@react-navigation/native'
import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LottieView from 'lottie-react-native';
import useColorStore from '../store/ColorStore';

const Loading = ({ navigation }: any) => {

  const currentTheme = useColorStore(state => state.currentTheme);
  const primaryColors = useColorStore(state => state.primaryColors);

  useFocusEffect(() => {
    const timeout = setTimeout(() => {
      navigation.navigate("SignIn")
    }, 3000)

    return () => clearTimeout(timeout)
  })

  return (
    <SafeAreaView>
      <LottieView style={{ width: 200, height: 200, alignSelf: 'center', backgroundColor: currentTheme.Background }} source={require('../assets/animations/loading.json')} autoPlay loop />
      <Text style={{ color: currentTheme.PrimaryText }}>loading...</Text>
    </SafeAreaView>
  )
}

export default Loading
