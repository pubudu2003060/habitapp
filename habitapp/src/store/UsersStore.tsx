import { create } from "zustand";
import { usersStoreType, userType } from "../types/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";


const useUsersStore = create<usersStoreType>((set, get) => ({
    users: [],

    adduser: async (newUser: userType) => {
        const currentUsers = get().users;
        const updatedUsers = [...currentUsers, newUser];

        await AsyncStorage.setItem("@users", JSON.stringify(updatedUsers));

        set({ users: updatedUsers });
    },

    removeUser: async (id: number) => {
        const currentUsers = get().users;
        const newList = currentUsers.filter((user) => user.id !== id);

        await AsyncStorage.setItem("@users", JSON.stringify(newList));

        set({ users: newList });
    },

    editUser: async (editUser: userType) => {
        const currentUsers = get().users;
        const updatedUsers = currentUsers.map((user) =>
            user.id === editUser.id ? editUser : user
        );

        await AsyncStorage.setItem("@users", JSON.stringify(updatedUsers));

        set({ users: updatedUsers });
    },

    isInUsers: (email: string) => {
        const users = get().users;
        return users.find((user) => user.email === email);
    }
}));

export default useUsersStore;
