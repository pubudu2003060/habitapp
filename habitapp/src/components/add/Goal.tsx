import React, { useState } from 'react'
import { StyleSheet, Text, TextInput, View, TouchableOpacity } from 'react-native'
import CheckBox from 'react-native-check-box'
import { habitType } from '../../types/Types'
import useColorStore from '../../store/ColorStore'

const Goal = ({ habit, setHabit }: { habit: habitType, setHabit: React.Dispatch<React.SetStateAction<habitType>> }) => {
    const currentTheme = useColorStore(state => state.currentTheme);
    const primaryColors = useColorStore(state => state.primaryColors);

    const [goal, setGoal] = useState<boolean>(false)
    const [activeSection, setActiveSection] = useState<string>("units");

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.Card }]}>
            <View style={styles.checkboxContainer}>
                <Text style={[styles.title, { color: currentTheme.PrimaryText }]}>Set Goal</Text>
                <CheckBox
                    onClick={() => { setGoal(!goal) }}
                    isChecked={goal}
                    checkBoxColor={primaryColors.Primary}
                    style={styles.checkbox}
                />
            </View>

            <View
                pointerEvents={!goal ? 'none' : 'auto'}
                style={[styles.buttonGroup, { opacity: goal ? 1 : 0.5 }]}
            >
                <TouchableOpacity
                    style={[styles.curvedButton, {
                        backgroundColor: activeSection === "units" ? primaryColors.Primary : currentTheme.SecondoryText
                    }]}
                    onPress={() => {
                        setActiveSection("units")
                        setHabit(h => ({ ...h, goal: { type: "units", amount: 0 } }))
                    }}
                >
                    <Text style={styles.buttonText}>Units</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.curvedButton, {
                        backgroundColor: activeSection === "timer" ? primaryColors.Primary : currentTheme.SecondoryText
                    }]}
                    onPress={() => {
                        setActiveSection("timer")
                        setHabit(h => ({ ...h, goal: { type: "timer", timePeriod: { hours: 0, minutes: 0 } } }))
                    }}
                >
                    <Text style={styles.buttonText}>Timer</Text>
                </TouchableOpacity>
            </View>

            <View style={[styles.inputContainer, { opacity: goal ? 1 : 0.5 }]}>
                {activeSection === "units" && (
                    <View pointerEvents={!goal ? 'none' : 'auto'} style={styles.unitsContainer}>
                        <Text style={[styles.inputLabel, { color: currentTheme.SecondoryText }]}>Units</Text>
                        <TextInput
                            style={[styles.input, {
                                borderColor: currentTheme.Border,
                                backgroundColor: currentTheme.Background,
                                color: currentTheme.PrimaryText
                            }]}
                            placeholder='Enter units'
                            placeholderTextColor={currentTheme.SecondoryText}
                            keyboardType="numeric"
                            value={habit.goal?.type === 'units' ? habit.goal.amount.toString() : ""}
                            onChangeText={(text) => setHabit(h => ({ ...h, goal: { type: "units", amount: Number(text) } }))}
                        />
                    </View>
                )}

                {activeSection === "timer" && (
                    <View pointerEvents={!goal ? 'none' : 'auto'} style={styles.timerContainer}>
                        <View style={styles.timerInputGroup}>
                            <Text style={[styles.inputLabel, { color: currentTheme.SecondoryText }]}>Hours</Text>
                            <TextInput
                                style={[styles.input, {
                                    borderColor: currentTheme.Border,
                                    backgroundColor: currentTheme.Background,
                                    color: currentTheme.PrimaryText
                                }]}
                                placeholder='Hours'
                                placeholderTextColor={currentTheme.SecondoryText}
                                keyboardType="numeric"
                                value={habit.goal?.type === 'timer' ? habit.goal.timePeriod.hours.toString() : "0"}
                                onChangeText={(text) => setHabit(h => ({
                                    ...h,
                                    goal: {
                                        type: 'timer',
                                        timePeriod: {
                                            hours: Number(text),
                                            minutes: h.goal?.type === 'timer' ? h.goal.timePeriod.minutes : 0
                                        }
                                    }
                                }))}
                            />
                        </View>

                        <View style={styles.timerInputGroup}>
                            <Text style={[styles.inputLabel, { color: currentTheme.SecondoryText }]}>Minutes</Text>
                            <TextInput
                                style={[styles.input, {
                                    borderColor: currentTheme.Border,
                                    backgroundColor: currentTheme.Background,
                                    color: currentTheme.PrimaryText
                                }]}
                                placeholder='Minutes'
                                placeholderTextColor={currentTheme.SecondoryText}
                                keyboardType="numeric"
                                value={habit.goal?.type === 'timer' ? habit.goal.timePeriod.minutes.toString() : "0"}
                                onChangeText={(text) => setHabit(h => ({
                                    ...h,
                                    goal: {
                                        type: 'timer',
                                        timePeriod: {
                                            hours: h.goal?.type === 'timer' ? h.goal.timePeriod.hours : 0,
                                            minutes: Number(text)
                                        }
                                    }
                                }))}
                            />
                        </View>
                    </View>
                )}
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
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    curvedButton: {
        flex: 1,
        marginHorizontal: 4,
        paddingVertical: 12,
        borderRadius: 999,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600',
    },
    inputContainer: {
        marginTop: 6,
    },
    unitsContainer: {
        marginBottom: 8,
    },
    timerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    timerInputGroup: {
        flex: 1,
        marginHorizontal: 4,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 8,
        marginLeft: 4,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
    }
});

export default Goal;
