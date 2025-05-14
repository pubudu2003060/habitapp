import React from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { PlatformPressable } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import useColorStore from '../store/ColorStore';

function TabBar({ state, descriptors, navigation }: { state: any; descriptors: Record<string, any>; navigation: any }) {
    const { buildHref } = useLinkBuilder();
    const currentTheme = useColorStore(state => state.currentTheme);
    const primaryColors = useColorStore(state => state.primaryColors);

    return (
        <SafeAreaView edges={['bottom']} style={[styles.container, { backgroundColor: currentTheme.Background }]}>
            <View style={[styles.tabBar, { backgroundColor: currentTheme.Card, shadowColor: currentTheme.Border }]}>
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    let iconName = '';
                    switch (route.name) {
                        case 'Home': iconName = 'home'; break;
                        case 'Explore': iconName = 'compass'; break;
                        case 'Add': iconName = 'plus'; break;
                        case 'Stat': iconName = 'bar-chart'; break;
                        case 'Profile': iconName = 'user'; break;
                        default: iconName = 'circle';
                    }

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });
                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name, route.params);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };


                    if (route.name === 'Add') {
                        return (
                            <PlatformPressable
                                key={route.key}
                                href={buildHref(route.name, route.params)}
                                accessibilityRole="button"
                                accessibilityState={isFocused ? { selected: true } : {}}
                                accessibilityLabel={options.tabBarAccessibilityLabel}
                                testID={options.tabBarButtonTestID}
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={styles.addButtonContainer}
                            >
                                <View style={[styles.addButton, { backgroundColor: primaryColors.Info, shadowColor: currentTheme.Border }]}>
                                    <Icon name={iconName} size={24} color={currentTheme.PrimaryText} />
                                </View>
                            </PlatformPressable>
                        );
                    }

                    return (
                        <PlatformPressable
                            key={route.key}
                            href={buildHref(route.name, route.params)}
                            accessibilityRole="button"
                            accessibilityState={isFocused ? { selected: true } : {}}
                            accessibilityLabel={options.tabBarAccessibilityLabel}
                            testID={options.tabBarButtonTestID}
                            onPress={onPress}
                            onLongPress={onLongPress}
                            style={styles.tabButton}
                        >
                            <Icon
                                name={iconName}
                                size={24}
                                color={isFocused ? primaryColors.Info : currentTheme.PrimaryText}
                            />
                        </PlatformPressable>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        bottom: 0,
        left: 0,
        right: 0,
    },
    tabBar: {
        flexDirection: 'row',
        height: 70,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        shadowOpacity: 0.1,
        elevation: 8,
        paddingHorizontal: 8,
        alignContent: 'center',
        justifyContent: 'space-between',
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    addButtonContainer: {
        top: -24,
        zIndex: 10,
    },
    addButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 6,
    },
});

export default TabBar;
