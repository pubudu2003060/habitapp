import React from 'react';
import { View, Text, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import useColorStore from '../store/ColorStore';
import { useUserStore } from '../store/UserStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import HeaderBar from '../components/header/HeaderBar';
import PictureBar from '../components/profile/PictureBar';
import Settings from '../components/profile/Settings';

const Profile = () => {
    const currentTheme = useColorStore(state => state.currentTheme);

  return (
    <SafeAreaView style={{ backgroundColor: currentTheme.Background, flex: 1 }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <HeaderBar title='Profile'/>
        <PictureBar/>
        
        <Settings/>
      </ScrollView>
    </SafeAreaView>
  );
};



export default Profile;