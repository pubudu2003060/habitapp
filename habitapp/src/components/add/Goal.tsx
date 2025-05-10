import React, { useState } from 'react'
import { Button, Text, TextInput, View } from 'react-native'
import CheckBox from 'react-native-check-box'
import { habitType } from '../../types/Types'

const Goal = ({ habit, setHabit }: { habit: habitType, setHabit: React.Dispatch<React.SetStateAction<habitType>> }) => {

    const [goal, setGoal] = useState<boolean>(false)

    const [activeSection, setActiveSection] = useState<string>("units");

    return (
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
                    <TextInput
                        placeholder='Enter units'
                        keyboardType="numeric"
                        value={habit.goal?.type === 'timer' ? habit.goal.timePeriod.hours.toString() : "0"}
                        onChangeText={(text) => setHabit(h => ({ ...h, goal: { type: 'timer', timePeriod: { hours: Number(text), minutes: h.goal?.type === 'timer' ? h.goal.timePeriod.minutes : 0 } } }))}
                    />
                    <TextInput
                        placeholder='Enter units'
                        keyboardType="numeric"
                        value={habit.goal?.type === 'timer' ? habit.goal.timePeriod.minutes.toString() : "0"}
                        onChangeText={(text) => setHabit(h => ({ ...h, goal: { type: 'timer', timePeriod: { hours: h.goal?.type === 'timer' ? h.goal.timePeriod.hours : 0, minutes: Number(text) } } }))}
                    />
                </View>}
            </View>
        </View>
    )
}

export default Goal
