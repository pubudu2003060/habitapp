import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signUpInputType, userType } from '../types/Types';
import { useuserStore } from '../store/UserStore';
import useUsersStore from '../store/UsersStore';

const SignUp = ({ navigation }: any) => {
    const [signUpInput, setSignUpInput] = useState<signUpInputType>({
        name: "",
        email: "",
        password: ""
    });

    const setUser = useuserStore(state => state.setUser);
    const adduser = useUsersStore(state => state.adduser)
    const isInUsers = useUsersStore(state => state.isInUsers);
    const users = useUsersStore(state => state.users);

    const signUp = () => {
        const { name, email, password } = signUpInput;

        if (!name.trim() || !email.trim() || !password.trim()) {
            return Alert.alert("Missing fields", "Please fill in all fields");
        }

        const isUserIn = isInUsers(email);

        if (isUserIn !== undefined) {
            return Alert.alert("User already exists", "Please log in instead.");
        }

        const newUser: userType = {
            id: users.length + 1,
            name,
            email,
            password
        };

        setUser(newUser);
        adduser(newUser)

        Alert.alert("Success", "Account created!", [
            { text: "OK", onPress: () => navigation.navigate("Home") }
        ]);
    };

    return (
        <SafeAreaView>
            <View>
                <Text>Sign Up</Text>
                <Text>Welcome to HabitApp</Text>
                <View>
                    <TextInput
                        value={signUpInput.name}
                        placeholder="Enter Name"
                        onChangeText={(text) => setSignUpInput(prev => ({ ...prev, name: text }))}
                    />
                    <TextInput
                        value={signUpInput.email}
                        placeholder="Enter Email"
                        onChangeText={(text) => setSignUpInput(prev => ({ ...prev, email: text }))}
                    />
                    <TextInput
                        value={signUpInput.password}
                        placeholder="Enter Password"
                        secureTextEntry
                        onChangeText={(text) => setSignUpInput(prev => ({ ...prev, password: text }))}
                    />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                    <Text>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={{ color: "blue" }}>Login</Text>
                    </TouchableOpacity>
                </View>
                <Button title='Sign Up' onPress={signUp} />
            </View>
        </SafeAreaView>
    );
};

export default SignUp;
