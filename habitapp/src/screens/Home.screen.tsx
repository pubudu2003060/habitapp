import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import ShortStatus from '../components/home/ShortStatus';
import useColorStore from '../store/ColorStore';
import HabitToComplete from '../components/home/HabitToComplete';

const Home = () => {

  const currentTheme = useColorStore(state => state.currentTheme);

  const [displayedDay, setDisplayedDay] = useState(new Date())

  return (
    <SafeAreaView style={{ backgroundColor: currentTheme.Background }}>
      <ScrollView>
        <ShortStatus displayedDay={displayedDay} setDisplayedDay={setDisplayedDay} />
        <HabitToComplete  displayedDay={displayedDay}/>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Home
