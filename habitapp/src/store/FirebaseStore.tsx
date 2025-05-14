import { habitType, userType } from "../types/Types"
import firestore, { Filter } from '@react-native-firebase/firestore';

const isuserInFireStore = async (email: String) => {
    try {
        const existinguser = await firestore()
            .collection('users')
            .where(Filter('email', '==', email))
            .get()

        return existinguser
    } catch (error) {
        console.log("user sign up data read error" + error)
    }
}

const addUserToFireStore = async (newUser: userType) => {
    try {
        await firestore()
            .collection('users')
            .add(newUser)
            .then(() => {
                console.log('User added!');
            });
    } catch (error) {
        console.log("user sign up data add error" + error)
    }
}

export const addHabittoFireStore = async (habit: habitType) => {
    try {
        await firestore()
            .collection('habits')
            .add(habit)
            .then(() => {
                console.log('User added!');
            });
    } catch (error) {
        console.log("user sign up data add error" + error)
    }
}

export const loadHabitsfromFireStore = async (user: userType) => {
    try {
        const habits = await firestore()
            .collection('habits')
            .where(Filter("userId", "==", user.id))
            .get()

        return habits;
    } catch (error) {
        console.log("user sign up data add error" + error)
    }
}

export { isuserInFireStore, addUserToFireStore }