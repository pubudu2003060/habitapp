import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { habitType } from '../../types/Types'
import useColorStore from '../../store/ColorStore'
import { useHabitStore } from '../../store/HabitsStore'
import CustomAlert from '../alert/CustomAlert'
import useCustomAlert from '../alert/UseCustomAlert'

const HabitCard = ({ habit }: { habit: habitType }) => {
  const currentTheme = useColorStore(state => state.currentTheme);
  const primaryColors = useColorStore(state => state.primaryColors);
  const finishHabit = useHabitStore(state => state.finishHabit);
  const deleteHabit = useHabitStore(state => state.deleteHabit);

  const { alertConfig, showAlert, hideAlert } = useCustomAlert();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return primaryColors.Primary;
      case 'pending':
        return primaryColors.Accent;
      default:
        return currentTheme.SecondoryText;
    }
  };

  const getHabitStatusColor = (status: string) => {
    switch (status) {
      case 'current':
        return primaryColors.Primary;
      case 'finished':
        return primaryColors.Info;
      case 'deleted':
        return primaryColors.Error;
      default:
        return currentTheme.SecondoryText;
    }
  };

  const formatDays = (days: string[]) => {
    if (days.length === 7) return 'Every day';
    if (days.length === 5 && !days.includes('Saturday') && !days.includes('Sunday')) return 'Weekdays';
    if (days.length === 2 && days.includes('Saturday') && days.includes('Sunday')) return 'Weekends';
    return days.map(day => day.slice(0, 3)).join(', ');
  };

  const calculateProgress = () => {
    if (!habit.goal || !habit.progress) return 0;

    if (habit.goal.type === 'units' && habit.progress.type === 'units') {
      return (habit.progress.completedAmount / habit.goal.amount) * 100;
    } else if (habit.goal.type === 'timer' && habit.progress.type === 'timer') {
      const goalMinutes = habit.goal.timePeriod.hours * 60 + habit.goal.timePeriod.minutes;
      const progressMinutes = habit.progress.completedTimePeriod.hours * 60 + habit.progress.completedTimePeriod.minutes;
      return goalMinutes > 0 ? (progressMinutes / goalMinutes) * 100 : 0;
    }
    return 0;
  };

  const handleFinishHabit = () => {
    showAlert(
      "Finish Habit",
      `Are you sure you want to mark "${habit.name}" as finished? This action will end the habit.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Finish",
          onPress: () => finishHabit(habit.id),
          style: "default"
        }
      ]
    );
  };

  const handleDeleteHabit = () => {
   showAlert(
      "Delete Habit",
      `Are you sure you want to delete "${habit.name}"? This will move it to deleted status and it will be permanently removed on the first day of next month.`,
      [
        { text: "Cancel", style: 'cancel' },
        {
          text: "Delete",
          onPress: () => deleteHabit(habit.id),
          style: "destructive"
        }
      ]
    );
  };

  const progressPercentage = calculateProgress();

  const isExpired = habit.endDate && new Date() >= new Date(habit.endDate);

  return (
    <View style={[
      styles.habitCard,
      {
        backgroundColor: currentTheme.Card,
        borderColor: currentTheme.Border,
        opacity: habit.habitStatus === 'deleted' ? 0.6 : 1
      }
    ]}>
      <View style={styles.headerContainer}>
        <View style={styles.titleContainer}>
          <Text style={[styles.habitName, { color: currentTheme.PrimaryText }]}>{habit.name}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusBadge, { backgroundColor: getHabitStatusColor(habit.habitStatus) }]}>
              <Text style={[styles.statusText, { color: currentTheme.ButtonText }]}>{habit.habitStatus}</Text>
            </View>
            {habit.habitStatus === 'current' && <View style={[styles.statusBadge, { backgroundColor: getStatusColor(habit.completeStatus) }]}>
              <Text style={[styles.statusText, { color: currentTheme.ButtonText }]}>{habit.completeStatus}</Text>
            </View>}
          </View>
        </View>
      </View>
      {isExpired && habit.habitStatus === 'current' && (
        <View style={[styles.warningContainer, { backgroundColor: primaryColors.Error + '20', borderColor: primaryColors.Error }]}>
          <Text style={[styles.warningText, { color: primaryColors.Error }]}>
            ⚠️ This habit is past its end date and will be automatically finished.
          </Text>
        </View>
      )}
      {habit.description && (
        <Text style={[styles.habitDescription, { color: currentTheme.SecondoryText }]}>{habit.description}</Text>
      )}
      {habit.goal && habit.habitStatus === 'current' && (
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { backgroundColor: currentTheme.Border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: progressPercentage === 100 ? primaryColors.Primary : primaryColors.Accent,
                  width: `${Math.min(progressPercentage, 100)}%`
                }
              ]}
            />
          </View>
          <Text style={[styles.progressText, { color: currentTheme.SecondoryText }]}>
            {Math.round(progressPercentage)}%
          </Text>
        </View>
      )}
      <View style={styles.infoGrid}>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: currentTheme.SecondoryText }]}>Repeat</Text>
          <Text style={[styles.infoValue, { color: currentTheme.PrimaryText }]}>
            {habit.repeat.type === 'daily' ? formatDays(habit.repeat.days) : habit.repeat.type}
          </Text>
        </View>
        {habit.goal && (
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: currentTheme.SecondoryText }]}>Goal</Text>
            <Text style={[styles.infoValue, { color: currentTheme.PrimaryText }]}>
              {habit.goal.type === 'units'
                ? `${habit.goal.amount} units`
                : `${habit.goal.timePeriod.hours}h ${habit.goal.timePeriod.minutes}m`}
            </Text>
          </View>
        )}
        {habit.progress && (
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: currentTheme.SecondoryText }]}>Progress</Text>
            <Text style={[styles.infoValue, { color: currentTheme.PrimaryText }]}>
              {habit.progress.type === 'units'
                ? `${habit.progress.completedAmount} units`
                : `${habit.progress.completedTimePeriod.hours}h ${habit.progress.completedTimePeriod.minutes}m`}
            </Text>
          </View>
        )}
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: currentTheme.SecondoryText }]}>Created</Text>
          <Text style={[styles.infoValue, { color: currentTheme.PrimaryText }]}>
            {new Date(habit.setDate).toLocaleDateString()}
          </Text>
        </View>
        {habit.lastCompletedDate && (
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: currentTheme.SecondoryText }]}>Last Done</Text>
            <Text style={[styles.infoValue, { color: currentTheme.PrimaryText }]}>
              {new Date(habit.lastCompletedDate).toLocaleDateString()}
            </Text>
          </View>
        )}
        {habit.endDate && (
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: currentTheme.SecondoryText }]}>End Date</Text>
            <Text style={[styles.infoValue, {
              color: isExpired ? primaryColors.Error : currentTheme.PrimaryText
            }]}>
              {new Date(habit.endDate).toLocaleDateString()}
            </Text>
          </View>
        )}
      </View>
      <View style={styles.buttonContainer}>
        {habit.habitStatus === 'current' && (
          <TouchableOpacity
            onPress={handleFinishHabit}
            style={[styles.actionButton, { backgroundColor: primaryColors.Info }]}
          >
            <Text style={[styles.buttonText, { color: currentTheme.ButtonText }]}>Finish</Text>
          </TouchableOpacity>
        )}
        {habit.habitStatus !== 'deleted' && (
          <TouchableOpacity
            onPress={handleDeleteHabit}
            style={[styles.actionButton, { backgroundColor: primaryColors.Error }]}
          >
            <Text style={[styles.buttonText, { color: currentTheme.ButtonText }]}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
      <CustomAlert
        visible={alertConfig.visible}
        title={alertConfig.title}
        message={alertConfig.message}
        buttons={alertConfig.buttons}
        onDismiss={hideAlert}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  habitCard: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContainer: {
    marginBottom: 12,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  habitName: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
    marginRight: 12,
  },
  statusContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  warningContainer: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 14,
    fontWeight: '500',
  },
  habitDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  progressBar: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: 12,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    fontWeight: '600',
    minWidth: 35,
    textAlign: 'right',
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  infoItem: {
    width: '50%',
    marginBottom: 8,
    paddingRight: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
    gap: 8,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  removeButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HabitCard;