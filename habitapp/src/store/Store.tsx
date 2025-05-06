import { create } from 'zustand'

const useuserStore = create((set) => ({
  user: [],
  addUser: () => { },
  removeUser: (id: number) => { },
  editUser: (id: number) => { }
}))