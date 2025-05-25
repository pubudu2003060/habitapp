import React from 'react';
import { StyleSheet, TextInput, View, Text, Animated } from 'react-native';
import { habitType } from '../../types/Types';
import useColorStore from '../../store/ColorStore';

const NameAndDescription = ({ habit, setHabit }: { habit: habitType, setHabit: React.Dispatch<React.SetStateAction<habitType>> }) => {

    const currentTheme = useColorStore(state => state.currentTheme);

    return (
        <View style={[styles.container, { backgroundColor: currentTheme.Card }]}>

            <View style={styles.inputContainer}>
                <TextInput
                    style={[
                        styles.input,
                        {
                            borderColor: currentTheme.Border,
                            backgroundColor: currentTheme.Background,
                            color: currentTheme.PrimaryText
                        }
                    ]}
                    placeholder='Name Your Habit.'
                    value={habit.name}
                    onChangeText={(text) => setHabit(h => ({ ...h, name: text }))}
                    placeholderTextColor={currentTheme.SecondoryText}
                    maxLength={40}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[
                        styles.input,
                        styles.descriptionInput,
                        {
                            borderColor: currentTheme.Border,
                            backgroundColor: currentTheme.Background,
                            color: currentTheme.PrimaryText
                        }
                    ]}
                    placeholder='Describe your Habit.'
                    value={habit.description}
                    onChangeText={(text) => setHabit(h => ({ ...h, description: text }))}
                    placeholderTextColor={currentTheme.SecondoryText}
                    multiline
                    numberOfLines={4}
                    maxLength={200}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 16,
        marginVertical: 20,
        borderRadius: 24,
        padding: 20,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    inputContainer: {
        marginBottom: 16,
    },
    input: {
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
    },
    descriptionInput: {
        height: 120,
        textAlignVertical: 'top',
        paddingTop: 14,
    },
});

export default NameAndDescription;