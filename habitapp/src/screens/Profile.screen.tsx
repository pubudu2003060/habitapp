import React, { useState } from 'react';
import { ScrollView } from 'react-native';
import useColorStore from '../store/ColorStore';
import { useUserStore } from '../store/UserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../components/header/HeaderBar';
import PictureBar from '../components/profile/PictureBar';
import Settings from '../components/profile/Settings';
import { useHabitStore } from '../store/HabitsStore';
import ChangeNameModal from '../components/profile/NameChangedModel';
import PrivacyPolicy from '../components/profile/PrivacyPolicy';

const Profile = () => {

  const habits = useHabitStore(state => state.habits)
  const totalHabits = habits.filter(habit => habit.habitStatus === 'current')
  const completed = totalHabits.filter(habit => habit.completeStatus === 'completed')
  const user = useUserStore(state => state.user)

  const currentTheme = useColorStore(state => state.currentTheme);

  const [nameModalVisible, setNameModalVisible] = useState(false);

  const handleSaveName = async (newName: string) => {
    const { user, editUser } = useUserStore.getState();
    if (!user) {
      console.error("No user is currently signed in.");
      return;
    }
    const updatedUser = {
      ...user,
      name: newName
    };
    try {
      await editUser(updatedUser);
      console.log("Name successfully updated to:", newName);
    } catch (error) {
      console.error("Failed to update name:", error);
    }
  };

  const [showPrivacy, setShowPrivacy] = useState(false);

  return (
    <SafeAreaView style={{ backgroundColor: currentTheme.Background, flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <HeaderBar title='Profile' />
        <PictureBar totalHabits={totalHabits.length} completedHabits={completed.length} name={user?.name} />
        <Settings visible={setNameModalVisible} privacyVisible={setShowPrivacy} />
        <ChangeNameModal
          visible={nameModalVisible}
          onClose={() => setNameModalVisible(false)}
          currentName={user?.name}
          onSave={handleSaveName}
        />
        <PrivacyPolicy
          visible={showPrivacy}
          onClose={() => setShowPrivacy(false)}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;