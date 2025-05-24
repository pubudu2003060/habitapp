import React, { useState } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import useColorStore from '../../store/ColorStore';
import { useUserStore } from '../../store/UserStore';

const Settings = ({ visible, navigation,privacyVisible }: any) => {

    const isDark = useColorStore(state => state.isDark);
    const setTheme = useColorStore(state => state.setTheme);
    const currentTheme = useColorStore(state => state.currentTheme);
    const primaryColors = useColorStore(state => state.primaryColors);
    const remove = useUserStore(state => state.signOut)

    const toggleTheme = () => {
        setTheme(isDark ? 'light' : 'dark');
    };

    return (
        <View style={styles.settingsContainer}>
            <Text style={[styles.sectionTitle, { color: currentTheme.PrimaryText }]}>Settings</Text>

            <View style={[styles.settingCard, { backgroundColor: currentTheme.Card }]}>
                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={[styles.settingLabel, { color: currentTheme.PrimaryText }]}>Profile Name</Text>
                        <Text style={[styles.currentValue, { color: currentTheme.SecondoryText }]}>
                            {"User"}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.themeButton, { backgroundColor: primaryColors.Primary }]}
                        onPress={() => visible(true)}
                    >
                        <Text style={styles.themeButtonText}>
                            Change
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.settingCard, { backgroundColor: currentTheme.Card }]}>
                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={[styles.settingLabel, { color: currentTheme.PrimaryText }]}>Theme</Text>
                        <Text style={[styles.currentValue, { color: currentTheme.SecondoryText }]}>
                            {isDark ? "Dark Mode" : "Light Mode"}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.themeButton, { backgroundColor: primaryColors.Primary }]}
                        onPress={toggleTheme}
                    >
                        <Text style={styles.themeButtonText}>
                            {isDark ? "Light Mode" : "Dark Mode"}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.settingCard, { backgroundColor: currentTheme.Card }]}>
                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={[styles.settingLabel, { color: currentTheme.PrimaryText }]}>Privacy Policy</Text>
                        <Text style={[styles.currentValue, { color: currentTheme.SecondoryText }]}>
                            View our privacy policy and data practices
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.themeButton, { backgroundColor: primaryColors.Primary }]}
                        onPress={()=>{privacyVisible(true)}}
                    >
                        <Text style={styles.themeButtonText}>
                            View
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={[styles.settingCard, { backgroundColor: currentTheme.Card }]}>
                <View style={styles.settingRow}>
                    <View style={styles.settingInfo}>
                        <Text style={[styles.settingLabel, { color: currentTheme.PrimaryText }]}>Account</Text>
                        <Text style={[styles.currentValue, { color: currentTheme.SecondoryText }]}>
                            Sign out from your account
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={[styles.logoutButton, { backgroundColor: primaryColors.Error }]}
                        onPress={remove}
                    >
                        <Text style={styles.logoutButtonText}>Logout</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    settingsContainer: {
        paddingHorizontal: 16,
        paddingTop: 24,
        marginBottom: 100
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 16,
        marginLeft: 4,
    },
    settingCard: {
        borderRadius: 16,
        marginBottom: 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }, settingInfo: {
        flex: 1,
        paddingRight: 8,
    },
    actionButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    actionButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    currentValue: {
        fontSize: 14,
    },
    settingLabel: {
        fontSize: 16,
        fontWeight: '600',
    },
    themeButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    themeButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    },
    logoutButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontWeight: '600',
        fontSize: 14,
    }
});

export default Settings
