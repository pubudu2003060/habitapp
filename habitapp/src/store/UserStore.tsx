import { create } from 'zustand';
import { signUpInputType, userStoreType, userType } from '../types/Types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useHabitStore } from './HabitsStore';
import auth from '@react-native-firebase/auth';
import firestore, { Filter } from '@react-native-firebase/firestore';

export const useUserStore = create<userStoreType>((set, get) => ({
  user: null,
  signInUser: async (user: signUpInputType) => {
    try {
      const userCredentials = await auth().signInWithEmailAndPassword(user.email, user.password)
      const uid = userCredentials.user.uid
      const snapshot = await firestore().collection('users').doc(uid).get()
      const userData = snapshot.data() as userType
      await AsyncStorage.setItem("@user", JSON.stringify(userData))
      set(() => ({
        user: userData
      }))
    } catch (error) {
      console.error('Sign In Error:', error);
    }
  },
  signUpUser: async (user: userType) => {
    try {
      const userCredentials = await auth().createUserWithEmailAndPassword(user.email, user.password)
      const uid = userCredentials.user.uid
      const newUser: userType = {
        id: uid,
        name: user.name,
        email: user.email,
        password: user.password,
      }
      await AsyncStorage.setItem('@user', JSON.stringify(newUser));
      set(() => ({
        user: newUser
      }))
      await firestore().collection('users').doc(uid).set(newUser)
    } catch (error) {
      console.error('Sign Up Error:', error);
    }
  },
  loadUser: async () => {
    const signedUser = await AsyncStorage.getItem("@user");
    set({ user: signedUser ? JSON.parse(signedUser) : null });
  },
  signOut: async () => {
    try {
      await auth().signOut();
      const removeHabits = useHabitStore.getState().removeAll
      removeHabits()
      await AsyncStorage.removeItem("@user");
      set({ user: null });
    } catch (error) {
      console.error('Sign Out Error:', error);
    }
  },
  editUser: async (editUser: userType) => {
    try {
      await firestore().collection('users').doc(editUser.id).update(editUser);
      await AsyncStorage.setItem("@user", JSON.stringify(editUser));
      set({ user: editUser });
    } catch (error) {
      console.error('Edit User Error:', error);
    }
  }
}));
