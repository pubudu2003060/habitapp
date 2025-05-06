import { create } from "zustand";
import { usersStoreType, userType } from "../types/Types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useuserStore } from "./UserStore";

const useUsersStore = create<usersStoreType>((set) => ({
    users: [],
    adduser: async (newUser: userType) => {
        await AsyncStorage.setItem("@users", JSON.stringify(newUser))
        set((state) => ({
            users: [...state.users], newUser
        }))
    },
    removeUser: async (id: number) => {
        let newList: userType[] = []
        set((state) => {
            newList = state.users.filter((user) => user.id !== id)
            return {
                users: newList
            }
        });
        await AsyncStorage.setItem("@users", JSON.stringify(
            newList
        ));
    },
    editUser: async (editUser: userType) => {
        set((state) => {
            const updatedUsers = state.users.map((user) =>
                user.id === editUser.id ? editUser : user
            );
            return { users: updatedUsers };
        });

        try {
            const users = useuserStore.getState();
            await AsyncStorage.setItem("@users", JSON.stringify(users));
        } catch (error) {
            console.error("Failed to save users to AsyncStorage:", error);
        }
    }
}))



export default useUsersStore