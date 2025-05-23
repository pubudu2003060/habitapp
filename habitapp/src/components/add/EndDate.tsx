import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import CheckBox from 'react-native-check-box'
import DatePicker from 'react-native-date-picker'
import { habitType } from '../../types/Types'
import useColorStore from '../../store/ColorStore'

const EndDate = ({ habit, setHabit }: { habit: habitType, setHabit: React.Dispatch<React.SetStateAction<habitType>> }) => {
    const currentTheme = useColorStore(state => state.currentTheme);
    const primaryColors = useColorStore(state => state.primaryColors);
    const isDark = useColorStore(state => state.isDark);

    const [open, setOpen] = useState<boolean>(false)
    const [endDate, setEndDate] = useState<boolean>(false)

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.Card }]}>
            <View style={styles.checkboxContainer}>
                <Text style={[styles.title, { color: currentTheme.PrimaryText }]}>Set to End Date</Text>
                <CheckBox
                    onClick={() => {
                        if (!habit.endDate) {
                            setHabit(h => ({ ...h, endDate: new Date() }));
                        } else {
                            setHabit(h => ({ ...h, endDate: null }));
                        }
                    }}
                    isChecked={habit.endDate ? true : false}
                    checkBoxColor={habit.endDate ? primaryColors.Primary : primaryColors.Error}
                    style={styles.checkbox}
                />
            </View>
            <View
                pointerEvents={!habit.endDate ? 'none' : 'auto'}
                style={[styles.dateSection, { opacity: habit.endDate ? 1 : 0.5 }]}
            >
                <Text style={[styles.label, { color: currentTheme.SecondoryText }]}>End</Text>
                <TouchableOpacity
                    style={[styles.buttonWrapper, { backgroundColor: primaryColors.Primary }]}
                    onPress={() => setOpen(true)}
                >
                    <Text style={[styles.buttonText, { color: currentTheme.ButtonText }]}>
                        {habit.endDate ? habit.endDate.toDateString() : "Select End Date"}
                    </Text>
                </TouchableOpacity>
                <DatePicker
                    modal
                    mode="date"
                    minimumDate={new Date()}
                    theme={isDark ? "dark" : "light"}
                    open={open}
                    date={habit.endDate !== null ? habit.endDate : new Date()}
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

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 12,
        padding: 20,
        borderRadius: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingHorizontal: 4,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
    },
    checkbox: {
        padding: 4,
    },
    dateSection: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 6,
    },
    label: {
        fontSize: 16,
        fontWeight: '500',
        marginBottom: 8,
        marginLeft: 4,
    },
    buttonWrapper: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 30,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
    }
});

export default EndDate
