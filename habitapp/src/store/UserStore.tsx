import { create } from 'zustand'
import { userStoreType, userType } from '../types/Types'

export const useuserStore = create<userStoreType>((set) => ({
  user: null,
  setUser: (newUser: userType) => {
    set((state: userStoreType) => {
      if (state.user === null) {
        return {
          user: newUser
        };
      }
      return state;
    })
  },
  removeUser: (id: number) => { },
  editUser: (id: number) => { }
}))

