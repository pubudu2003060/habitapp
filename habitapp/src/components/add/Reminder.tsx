import React from 'react'
import { Text, View } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { habitType } from '../../types/Types';

const Reminder = ({ habit, setHabit }: { habit: habitType, setHabit: React.Dispatch<React.SetStateAction<habitType>> }) => {
    return (
        <View>
            <Text>Reminder</Text>
            <Text>{habit.reminder.toTimeString()}</Text>
            <DatePicker
                mode='time'
                date={habit.reminder}
                onDateChange={(date) => {
                    setHabit(h => {
                        const hours = date.getHours();
                        const minutes = date.getMinutes();
                        const newReminder = new Date(0, 0, 0, hours, minutes);
                        return { ...h, reminder: newReminder };
                    });
                }}
            />

        </View>
    )
}

export default Reminder
