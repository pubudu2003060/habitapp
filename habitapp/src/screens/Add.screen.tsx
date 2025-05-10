import React, { useState } from 'react'
import { Button, ScrollView, Text, TextInput, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { DayOfWeek, habitType } from '../types/Types';
import CheckBox from 'react-native-check-box'
import DatePicker from 'react-native-date-picker';

const Add = () => {

  const [habit, setHabit] = useState<habitType>(
    {
      name: "",
      description: "",
      repeat: { type: "daily", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] },
      endDate: null,
      goal: null,
      reminder: null
    })

  const [endDate, setEndDate] = useState<boolean>(false)

  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState<boolean>(false)
  const [goal, setGoal] = useState<boolean>(false)

  const [activeSection, setActiveSection] = useState<string>("units");

  const allDays: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const shortDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  const togalDay = (day: DayOfWeek) => {
    setHabit(h => {
      const days = h.repeat.type === "daily" ? h.repeat.days : [];
      const updatedDays = days.includes(day)
        ? days.filter(d => d !== day)
        : [...days, day];

      return {
        ...h,
        repeat: { type: "daily", days: updatedDays }
      };
    });
  }


  return (
    <SafeAreaView>
      <ScrollView>
        <Text>Create Habit</Text>
        <View>
          <TextInput
            placeholder='Name your Habit'
            value={habit.name}
            onChangeText={(text) => setHabit(h => ({ ...h, name: text }))}
          />
          <TextInput
            placeholder='Describe your Habit'
            value={habit.description}
            onChangeText={(text) => setHabit(h => ({ ...h, description: text }))}
          />
        </View>
        <View>
          <Text>Repeat</Text>
          <View>
            <Button title='Daily' onPress={() => { setHabit(h => ({ ...h, repeat: { type: "daily", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] } })) }}></Button>
            <Button title='Weekly' onPress={() => { setHabit(h => ({ ...h, repeat: { type: "weekly" } })) }}></Button>
            <Button title='Monthly' onPress={() => { setHabit(h => ({ ...h, repeat: { type: "monthly" } })) }}></Button>
          </View>
          <View>
            {shortDays.map((day, index) => {
              const disabled = habit.repeat.type === "daily" ? false : true
              const fullDay: DayOfWeek = allDays[index];
              const isSelected = habit.repeat.type === "daily" && habit.repeat.days.includes(fullDay);
              return (
                (
                  <Button
                    key={index}
                    title={day}
                    disabled={disabled}
                    color={isSelected ? "" : "gray"}
                    onPress={() => { togalDay(fullDay) }}></Button>
                )
              )
            })}
          </View>
        </View>
        <View>
          <View>
            <Text>Set to End Date</Text>
            <CheckBox
              onClick={() => { setEndDate(!endDate) }}
              isChecked={endDate}
            />
          </View>
          <View pointerEvents={!endDate ? 'none' : 'auto'}>
            <Text >End</Text>
            <Button title={habit.endDate ? habit.endDate.toDateString() : "EndDate"} onPress={() => setOpen(true)} />
            <DatePicker
              modal
              mode="date"
              open={open}
              date={date}
              onConfirm={(date) => {
                setOpen(false)
                setHabit(h => ({ ...h, endDate: date }))
              }}
              onCancel={() => {
                setOpen(false)
              }}
            />
          </View>
        </View>
        <View>
          <View>
            <Text>Set Goal</Text>
            <CheckBox
              onClick={() => { setGoal(!goal) }}
              isChecked={goal}
            />
          </View>
          <View pointerEvents={!goal ? 'none' : 'auto'} style={{}}>
            <Button title='Units' onPress={() => {
              setActiveSection("units")
              setHabit(h => ({ ...h, goal: { type: "units", amount: 0 } }))
            }} ></Button>
            <Button title='Timer' onPress={() => {
              setActiveSection("timer")
              setHabit(h => ({ ...h, goal: { type: "timer", timePeriod: { hours: 0, minutes: 0 } } }))
            }} ></Button>
          </View>
          <View >
            {activeSection === "units" && <View pointerEvents={!goal ? 'none' : 'auto'}>
              <TextInput
                placeholder='Enter units'
                keyboardType="numeric"
                value={habit.goal?.type === 'units' ? habit.goal.amount.toString() : ""}
                onChangeText={(text) => setHabit(h => ({ ...h, goal: { type: "units", amount: Number(text) } }))}
              />
            </View>}
            {activeSection === "timer" && <View pointerEvents={!goal ? 'none' : 'auto'}>
              <DatePicker
                date={new Date()}
                mode="time"
                onDateChange={(date) => { setHabit(h => ({ ...h, goal: { type: 'timer', timePeriod: { hours: Number(date.getHours), minutes: Number(date.getMinutes) } } })) }}
              />
            </View>}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default Add
