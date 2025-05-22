import React, { useState } from 'react'
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { habitStoreType, habitType } from '../types/Types';
import NameAndDescription from '../components/add/NameAndDescription';
import Repeat from '../components/add/Repeat';
import EndDate from '../components/add/EndDate';
import Goal from '../components/add/Goal';
import Reminder from '../components/add/Reminder';
import HeaderBar from '../components/header/HeaderBar';
import useColorStore from '../store/ColorStore';
import { useUserStore } from '../store/UserStore';
import { useHabitStore } from '../store/HabitsStore';

const Add = () => {

  const user = useUserStore(state => state.user)

  const primaryColors = useColorStore(state => state.primaryColors);
  const currentTheme = useColorStore(state => state.currentTheme);

  const addHabit = useHabitStore(state => state.addHabit)

  const [habit, setHabit] = useState<habitType>(
    {
      id: Date.now(),
      userId: user?.id || "",
      name: "",
      description: "",
      repeat: { type: "daily", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
      endDate: null,
      goal: null,
      progress:null,
      reminder: new Date(0, 0, 0),
      lastCompletedDate:undefined,
      completeStatus:"pending",
      habitStatus: "current",
      setDate: new Date()
    })

  const add = () => {
    if (habit.name.trim() == "" || habit.description.trim() == "") {
      return Alert.alert("Add name and Description!")
    }
    if (habit.repeat.type === "daily" && habit.repeat.days.length === 0) {
      return Alert.alert("Add Days to Repeat!")
    }
    addHabit(habit)
    Alert.alert("Habit added Succesfully!")
    setHabit({
     id: Date.now(),
      userId: user?.id || "",
      name: "",
      description: "",
      repeat: { type: "daily", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
      endDate: null,
      goal: null,
      progress:null,
      reminder: new Date(0, 0, 0),
      lastCompletedDate:undefined,
      completeStatus:"pending",
      habitStatus: "current",
      setDate: new Date()
    })
  }

  return (
    <SafeAreaView style={{ backgroundColor: currentTheme.Background }}>
      <ScrollView  showsHorizontalScrollIndicator={false}>
        <HeaderBar title="Create Habit"></HeaderBar>
        <NameAndDescription habit={habit} setHabit={setHabit} />
        <Repeat habit={habit} setHabit={setHabit} />
        <EndDate habit={habit} setHabit={setHabit} />
        <Goal habit={habit} setHabit={setHabit} />
        <Reminder habit={habit} setHabit={setHabit} />
        <View style={{ marginBottom: 100 }}>
          <TouchableOpacity
            style={[
              styles.customButton,
              {
                backgroundColor: primaryColors.Primary
              }
            ]}

            onPress={() => { add() }}
          >
            <Text style={[styles.buttonText, { color: currentTheme.ButtonText }]}>Add Habit</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  customButton: {
    flex: 1,
    marginHorizontal: 16,
    marginVertical: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
  }
})

export default Add
