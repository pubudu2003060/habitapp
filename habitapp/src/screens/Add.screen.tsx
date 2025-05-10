import React, { useState } from 'react'
import { Button, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { DayOfWeek, habitType } from '../types/Types';
import CheckBox from 'react-native-check-box'
import DatePicker from 'react-native-date-picker';
import NameAndDescription from '../components/navigation/add/NameAndDescription';
import Repeat from '../components/navigation/add/Repeat';
import EndDate from '../components/navigation/add/EndDate';
import Goal from '../components/navigation/add/Goal';
import Reminder from '../components/navigation/add/Reminder';

const Add = () => {

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
    <SafeAreaView>
      <ScrollView>
        <Text>Create Habit</Text>
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
