import React from 'react'
import { TextInput, View } from 'react-native'
import { habitType } from '../../../types/Types'

const NameAndDescription = ({ habit, setHabit }: { habit: habitType, setHabit: React.Dispatch<React.SetStateAction<habitType>> }) => {
    return (
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
    )
}

export default NameAndDescription
