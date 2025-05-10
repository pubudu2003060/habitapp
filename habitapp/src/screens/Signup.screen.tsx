import React, { useState } from 'react';
import { Alert, Button, Text, TextInput, TouchableOpacity, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signUpInputType, userType } from '../types/Types';
import { useuserStore } from '../store/UserStore';
import useUsersStore from '../store/UsersStore';
import useColorStore from '../store/ColorStore';

const SignUp = ({ navigation }: any) => {
    const currentTheme = useColorStore(state => state.currentTheme);
    const primaryColors = useColorStore(state => state.primaryColors);

    const [signUpInput, setSignUpInput] = useState<signUpInputType>({
        name: "",
        email: "",
        password: ""
    });

    const setUser = useuserStore(state => state.setUser);
    const adduser = useUsersStore(state => state.adduser);
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
        adduser(newUser);

        Alert.alert("Success", "Account created!", [
            { text: "OK", onPress: () => navigation.navigate("Home") }
        ]);
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: currentTheme.Background }]}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={[styles.title, { color: currentTheme.PrimaryText }]}>Sign Up</Text>
                    <Text style={[styles.subtitle, { color: currentTheme.SecondoryText }]}>Welcome to HabitApp</Text>
                </View>
                <View style={styles.formContainer}>
                    <TextInput
                        style={[styles.input, {
                            borderColor: currentTheme.Border,
                            backgroundColor: currentTheme.Card,
                            color: currentTheme.PrimaryText
                        }]}
                        value={signUpInput.name}
                        placeholder="Enter Name"
                        placeholderTextColor={currentTheme.SecondoryText}
                        onChangeText={(text) => setSignUpInput(prev => ({ ...prev, name: text }))}
                    />
                    <TextInput
                        style={[styles.input, {
                            borderColor: currentTheme.Border,
                            backgroundColor: currentTheme.Card,
                            color: currentTheme.PrimaryText
                        }]}
                        value={signUpInput.email}
                        placeholder="Enter Email"
                        placeholderTextColor={currentTheme.SecondoryText}
                        autoCapitalize="none"
                        onChangeText={(text) => setSignUpInput(prev => ({ ...prev, email: text }))}
                    />
                    <TextInput
                        style={[styles.input, {
                            borderColor: currentTheme.Border,
                            backgroundColor: currentTheme.Card,
                            color: currentTheme.PrimaryText
                        }]}
                        value={signUpInput.password}
                        placeholder="Enter Password"
                        placeholderTextColor={currentTheme.SecondoryText}
                        secureTextEntry
                        onChangeText={(text) => setSignUpInput(prev => ({ ...prev, password: text }))}
                    />
                </View>
                <View style={styles.loginTextContainer}>
                    <Text style={{ color: currentTheme.SecondoryText }}>Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={{ color: primaryColors.Primary, fontWeight: '600' }}>Login</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={[styles.signUpButton, { backgroundColor: primaryColors.Primary }]}
                        onPress={signUp}
                    >
                        <Text style={[styles.buttonText, { color: currentTheme.ButtonText }]}>Sign Up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        marginBottom: 36,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '400',
    },
    formContainer: {
        marginBottom: 24,
    },
    input: {
        height: 56,
        borderWidth: 1,
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        fontSize: 16,
    },
    loginTextContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    buttonContainer: {
        marginVertical: 8,
    },
    signUpButton: {
        height: 56,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '600',
    }
});

export default SignUp;
