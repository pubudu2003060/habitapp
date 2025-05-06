import React, { useState } from 'react'
import { Alert, Button, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { signInInputType, userType } from '../types/Types'
import { useuserStore } from '../store/UserStore'
import useUsersStore from '../store/UsersStore'

const SignIn = ({ navigation }: any) => {
    const [signInInput, setSignInInput] = useState<signInInputType>({
        email: "",
        password: ""
    });

    const setUser = useuserStore(state => state.setUser);
    const isInUsers = useUsersStore(state => state.isInUsers);

    const signIn = () => {
        const { email, password } = signInInput;

        if (!email.trim() || !password.trim()) {
            return Alert.alert(
                "Missing Fields",
                "Please enter both email and password."
            );
        }

        const existingUser = isInUsers(email);

        if (!existingUser) {
            return Alert.alert("Account not found", "No user registered with this email.");
        }

        if (existingUser.password !== password) {
            return Alert.alert("Incorrect password", "Please check your password and try again.");
        }

        setUser(existingUser);
    };

    return (
        <SafeAreaView>
            <View>
                <Text>Sign In</Text>
                <Text>Welcome back to HabitApp</Text>
                <View>
                    <TextInput
                        value={signInInput.email}
                        placeholder="Enter Email"
                        autoCapitalize="none"
                        onChangeText={(text) => setSignInInput(prev => ({ ...prev, email: text }))}
                    />
                    <TextInput
                        value={signInInput.password}
                        placeholder="Enter Password"
                        secureTextEntry
                        onChangeText={(text) => setSignInInput(prev => ({ ...prev, password: text }))}
                    />
                </View>
                <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                    <Text>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                        <Text style={{ color: "blue" }}>Sign up</Text>
                    </TouchableOpacity>
                </View>
                <Button title="Sign In" onPress={signIn} />
            </View>
        </SafeAreaView>
    );
};

export default SignIn;
