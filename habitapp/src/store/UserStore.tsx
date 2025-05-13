import { create } from 'zustand';
import { userStoreType, userType } from '../types/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useuserStore = create<userStoreType>((set, get) => ({
  user: null,
  setUser: async (newUser: userType) => {
    await AsyncStorage.setItem("@user", JSON.stringify(newUser));
    set({ user: newUser });
  },
  loadUser: async () => {
    const signedUser = await AsyncStorage.getItem("@user");
    set({ user: signedUser ? JSON.parse(signedUser) : null });
  },
  removeUser: async () => {
    await AsyncStorage.removeItem("@user");
    set({ user: null });
  },
  editUser: async (editUser: userType) => {
    set({ user: editUser });
    await AsyncStorage.setItem("@user", JSON.stringify(editUser));
  }
}));
