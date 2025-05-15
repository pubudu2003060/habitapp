import React from 'react';
import { View, Text, Button } from 'react-native';
import useColorStore from '../store/ColorStore';
import { useUserStore } from '../store/UserStore';

const Profile = () => {
  const isDark = useColorStore(state => state.isDark);
  const setTheme = useColorStore(state => state.setTheme);
  const currentTheme = useColorStore(state => state.currentTheme);
  const primaryColors = useColorStore(state => state.primaryColors);
  const remove = useUserStore(state => state.signOut)

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  return (
    <View style={{ flex: 1, backgroundColor: currentTheme.Background, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: currentTheme.PrimaryText, fontSize: 20, marginBottom: 20 }}>Profile</Text>
      <Button
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        onPress={toggleTheme}
        color={primaryColors.Info}
      />
        <Button title="logout" onPress={remove}></Button>
    </View>
  );
};

export default Profile;
