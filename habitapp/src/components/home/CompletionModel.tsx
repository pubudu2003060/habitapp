import React, { useEffect, useState } from 'react'
import { Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import useColorStore from '../../store/ColorStore';
import { habitType } from '../../types/Types';
import { useHabitStore } from '../../store/HabitsStore';


const CompletionModel = ({ modalVisible, setModalVisible, habit }: { modalVisible: boolean, setModalVisible: React.Dispatch<React.SetStateAction<boolean>>, habit: habitType }) => {

  const currentTheme = useColorStore(state => state.currentTheme)
  const primaryColors = useColorStore(state => state.primaryColors)

  const updateProgress = useHabitStore(state => state.updateProgress)

  const [unitsCompleted, setUnitsCompleted] = useState<string>('0');

  useEffect(() => {
    setUnitsCompleted(habit.progress?.type === 'units' ? habit.progress.completedAmount.toString() : '0')
  }, [habit])

  const [hours, setHours] = useState<string>('0');

  useEffect(() => {
    setHours(habit.progress?.type === 'timer' ? habit.progress.completedTimePeriod.hours.toString() : '0')
  }, [habit])

  const [minutes, setMinutes] = useState<string>('0');

  useEffect(() => {
    setMinutes(habit.progress?.type === 'timer' ? habit.progress.completedTimePeriod.minutes.toString() : '0')
  }, [habit])

  const handleComplete = async () => {
    try {
      let newProgress: habitType['progress'] = null;

      if (habit.goal?.type === 'units') {
        const completedAmount = parseInt(unitsCompleted) || 0;
        newProgress = {
          type: 'units',
          completedAmount
        };
      } else if (habit.goal?.type === 'timer') {
        const hoursVal = parseInt(hours) || 0;
        const minutesVal = parseInt(minutes) || 0;
        newProgress = {
          type: 'timer',
          completedTimePeriod: {
            hours: hoursVal,
            minutes: minutesVal
          }
        };
      }

      if (newProgress) {
        updateProgress(habit.id, newProgress);
      } else {
        updateProgress(habit.id, newProgress);
      }
      setModalVisible(false);
    } catch (error) {
      console.error('Error completing habit:', error);
    }
  };

  const renderProgressInput = () => {
    if (habit.goal?.type === 'units') {
      return (
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: currentTheme.PrimaryText }]}>
            Units completed: ({unitsCompleted}/{habit.goal.amount})
          </Text>
          <TextInput
            style={[styles.input, {
              borderColor: currentTheme.Border,
              color: currentTheme.PrimaryText
            }]}
            keyboardType="numeric"
            value={unitsCompleted}
            onChangeText={setUnitsCompleted}
            placeholder="Enter amount"
            placeholderTextColor={currentTheme.SecondoryText}
          />
        </View>
      );
    } else if (habit.goal?.type === 'timer') {
      return (
        <View style={styles.inputContainer}>
          <Text style={[styles.inputLabel, { color: currentTheme.PrimaryText }]}>
            Time completed: (Goal: {habit.goal.timePeriod.hours}h {habit.goal.timePeriod.minutes}m)
          </Text>
          <View style={styles.timerInputs}>
            <View style={styles.timeInputWrapper}>
              <TextInput
                style={[styles.timeInput, {
                  borderColor: currentTheme.Border,
                  color: currentTheme.PrimaryText
                }]}
                keyboardType="numeric"
                value={hours}
                onChangeText={setHours}
                placeholder="0"
                placeholderTextColor={currentTheme.SecondoryText}
              />
              <Text style={[styles.timeLabel, { color: currentTheme.SecondoryText }]}>hours</Text>
            </View>

            <Text style={{ color: currentTheme.PrimaryText, fontSize: 18 }}>:</Text>

            <View style={styles.timeInputWrapper}>
              <TextInput
                style={[styles.timeInput, {
                  borderColor: currentTheme.Border,
                  color: currentTheme.PrimaryText
                }]}
                keyboardType="numeric"
                value={minutes}
                onChangeText={setMinutes}
                placeholder="0"
                placeholderTextColor={currentTheme.SecondoryText}
              />
              <Text style={[styles.timeLabel, { color: currentTheme.SecondoryText }]}>mins</Text>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <Text style={[styles.modalText, { color: currentTheme.PrimaryText }]}>
          Mark this habit as complete?
        </Text>
      );
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: currentTheme.Card }]}>
          <Text style={[styles.habitTitle, { color: currentTheme.PrimaryText }]}>
            {habit.name}
          </Text>

          {habit.description && (
            <Text style={[styles.habitDescription, { color: currentTheme.SecondoryText }]}>
              {habit.description}
            </Text>
          )}

          {renderProgressInput()}

          <View style={styles.modalActions}>
            <TouchableOpacity
              onPress={handleComplete}
              style={[styles.modalButton, { backgroundColor: primaryColors.Primary }]}
            >
              <Text style={{ color: currentTheme.ButtonText, fontWeight: '600' }}>
                Complete
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={[styles.modalButton, { backgroundColor: '#ccc' }]}
            >
              <Text style={{ color: '#000', fontWeight: '600' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalContent: {
    width: '85%',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  habitTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  habitDescription: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginVertical: 12,
  },
  inputLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    width: '100%',
  },
  timerInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 10,
  },
  timeInputWrapper: {
    alignItems: 'center',
    flex: 1,
  },
  timeInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    textAlign: 'center',
    width: '100%',
  },
  timeLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
})

export default CompletionModel