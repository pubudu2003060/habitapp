import { create } from 'zustand'
import { userStoreType, userType } from '../types/Types'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const useuserStore = create<userStoreType>((set) => ({
  user: null,
  setUser: async (newUser: userType) => {
    await AsyncStorage.setItem("@user", JSON.stringify(newUser))
    set((state: userStoreType) => ({
      user: newUser
    }))
  },
  loadUser: async () => {
    let signedUser = await AsyncStorage.getItem("@user")
    set((state: userStoreType) => ({
      user: signedUser ? JSON.parse(signedUser) : null
    }))
  },
  removeUser: async () => {
    await AsyncStorage.removeItem('@user')
    set((state: userStoreType) => ({
      user: null
    }))
  },
  editUser: async (editUser: userType) => {
    set((state: userStoreType) => ({
      user: editUser
    }))
    await AsyncStorage.setItem("@user", JSON.stringify(editUser))
  }
}))

