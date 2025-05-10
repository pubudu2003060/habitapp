import React from 'react'
import { Button, Text, View } from 'react-native'
import { DayOfWeek, habitType } from '../../types/Types'

const Repeat = ({ habit, setHabit }: { habit: habitType, setHabit: React.Dispatch<React.SetStateAction<habitType>> }) => {

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
    )
}

export default Repeat
