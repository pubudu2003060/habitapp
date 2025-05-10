import React from 'react';
import { View, Text, Button } from 'react-native';
import useColorStore from '../store/ColorStore';

const Profile = () => {
  const isDark = useColorStore(state => state.isDark);
  const setTheme = useColorStore(state => state.setTheme);
  const currentTheme = useColorStore(state => state.currentTheme);
  const primaryColors = useColorStore(state => state.primaryColors);

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
    </View>
  );
};

export default Profile;
