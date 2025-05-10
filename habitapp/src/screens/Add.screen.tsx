import React, { useState } from 'react'
import { ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { habitType } from '../types/Types';
import NameAndDescription from '../components/add/NameAndDescription';
import Repeat from '../components/add/Repeat';
import EndDate from '../components/add/EndDate';
import Goal from '../components/add/Goal';
import Reminder from '../components/add/Reminder';
import HeaderBar from '../components/header/HeaderBar';
import useColorStore from '../store/ColorStore';

const Add = () => { 

  const currentTheme = useColorStore(state => state.currentTheme);

  const [habit, setHabit] = useState<habitType>(
    {
      name: "",
      description: "",
      repeat: { type: "daily", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
      endDate: null,
      goal: null,
      reminder: new Date(0, 0, 0, 8, 30)
    })

  return (
    <SafeAreaView style={{backgroundColor:currentTheme.Background}}>
      <ScrollView>
        <HeaderBar title="Create Habit"></HeaderBar>
        <NameAndDescription habit={habit} setHabit={setHabit} />
        <Repeat habit={habit} setHabit={setHabit} />
        <EndDate habit={habit} setHabit={setHabit} />
        <Goal habit={habit} setHabit={setHabit} />
        <Reminder habit={habit} setHabit={setHabit} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default Add
