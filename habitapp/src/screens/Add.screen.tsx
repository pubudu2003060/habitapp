import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { habitType } from '../types/Types';
import NameAndDescription from '../components/add/NameAndDescription';
import Repeat from '../components/add/Repeat';
import EndDate from '../components/add/EndDate';
import Goal from '../components/add/Goal';
import Reminder from '../components/add/Reminder';
import HeaderBar from '../components/header/HeaderBar';
import useColorStore from '../store/ColorStore';
import { useUserStore } from '../store/UserStore';
import { useHabitStore } from '../store/HabitsStore';
import CustomAlert from '../components/alert/CustomAlert';
import useCustomAlert from '../components/alert/UseCustomAlert';

const Add = () => {

  const user = useUserStore(state => state.user)

  const primaryColors = useColorStore(state => state.primaryColors);
  const currentTheme = useColorStore(state => state.currentTheme);

  const addHabit = useHabitStore(state => state.addHabit)

  const { alertConfig, showAlert, hideAlert } = useCustomAlert();

  const [habit, setHabit] = useState<habitType>(
    {
      id: Date.now(),
      userId: user?.id || "",
      name: "",
      description: "",
      repeat: { type: "daily", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
      endDate: null,
      goal: null,
      progress: null,
      reminder: (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })(),
      lastCompletedDate: undefined,
      completeStatus: "pending",
      habitStatus: "current",
      setDate: new Date()
    })

  const add = () => {
    if (habit.name.trim() == "" || habit.description.trim() == "") {
      return showAlert("Add name and Description!")
    }
    if (habit.repeat.type === "daily" && habit.repeat.days.length === 0) {
      return showAlert("Add Days to Repeat!")
    }
    addHabit(habit)
    showAlert("Habit added Succesfully!")
    setHabit({
      id: Date.now(),
      userId: user?.id || "",
      name: "",
      description: "",
      repeat: { type: "daily", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
      endDate: null,
      goal: null,
      progress: null,
      reminder: (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; })(),
      lastCompletedDate: undefined,
      completeStatus: "pending",
      habitStatus: "current",
      setDate: new Date()
    })
  }

  return (
    <SafeAreaView style={{ backgroundColor: currentTheme.Background }}>
      <ScrollView showsHorizontalScrollIndicator={false}>
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
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={hideAlert}
      />
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
