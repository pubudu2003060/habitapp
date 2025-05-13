import { userType } from "../types/Types"
import firestore, { Filter } from '@react-native-firebase/firestore';

const isuserInFireStore = async (newUser: userType) => {
    try {
        const existinguser = await firestore()
            .collection('users')
            .where(Filter('email', '==', newUser.email))
            .get()
        return !existinguser.empty
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

export { isuserInFireStore, addUserToFireStore }