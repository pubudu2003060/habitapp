import React, { useState } from 'react'
import { Button, Text, View } from 'react-native'
import CheckBox from 'react-native-check-box'
import DatePicker from 'react-native-date-picker'
import { habitType } from '../../types/Types'

const EndDate = ({ habit, setHabit }: { habit: habitType, setHabit: React.Dispatch<React.SetStateAction<habitType>> }) => {

    const [date, setDate] = useState(new Date())
    const [open, setOpen] = useState<boolean>(false)
    const [endDate, setEndDate] = useState<boolean>(false)

    return (
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
    )
}

export default EndDate
