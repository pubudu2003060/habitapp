import React from 'react';
import { View, Platform, StyleSheet, Text } from 'react-native';
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
        <SafeAreaView edges={['bottom']} style={[styles.container, { backgroundColor: currentTheme.Card }]}>
            <View style={[styles.tabBar, {
                backgroundColor: currentTheme.Card,
                shadowColor: currentTheme.Border,
                borderTopColor: currentTheme.Border,
            }]}>
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];
                    const isFocused = state.index === index;

                    let iconName = '';
                    let label = '';
                    switch (route.name) {
                        case 'Home':
                            iconName = 'home';
                            label = 'Home';
                            break;
                        case 'Explore':
                            iconName = 'compass';
                            label = 'Explore';
                            break;
                        case 'Add':
                            iconName = 'plus';
                            label = '';
                            break;
                        case 'Stat':
                            iconName = 'bar-chart';
                            label = 'Stats';
                            break;
                        case 'Profile':
                            iconName = 'user';
                            label = 'Profile';
                            break;
                        default:
                            iconName = 'circle';
                            label = route.name;
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
                                <View style={[styles.addButton, {
                                    backgroundColor: primaryColors.Info,
                                    shadowColor: 'rgba(0,0,0,0.3)',
                                    borderWidth: 4,
                                    borderColor: currentTheme.Card,
                                }]}>
                                    <Icon name={iconName} size={26} color={currentTheme.ButtonText} />
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
                            style={[
                                styles.tabButton,
                                isFocused && styles.focusedTab
                            ]}
                        >
                            <View style={styles.tabContent}>
                                {isFocused && (
                                    <View style={[styles.indicator, { backgroundColor: primaryColors.Info }]} />
                                )}
                                <Icon
                                    name={iconName}
                                    size={22}
                                    color={isFocused ? primaryColors.Info : currentTheme.SecondoryText}
                                    style={styles.tabIcon}
                                />
                                <Text style={[
                                    styles.tabLabel,
                                    {
                                        color: isFocused ? primaryColors.Info : currentTheme.SecondoryText,
                                        opacity: isFocused ? 1 : 0.7
                                    }
                                ]}>
                                    {label}
                                </Text>
                            </View>
                        </PlatformPressable>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
    },
    tabBar: {
        flexDirection: 'row',
        height: 80,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        shadowOpacity: 0.2,
        shadowOffset: {
            width: 0,
            height: -3,
        },
        shadowRadius: 6,
        elevation: 12,
        paddingHorizontal: 10,
        paddingBottom: 8,
        alignContent: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 0.5,
    },
    tabButton: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 6,
        backgroundColor: 'transparent',
    },
    focusedTab: {
        paddingTop: 8,
    },
    tabContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIcon: {
        marginBottom: 4,
    },
    tabLabel: {
        fontSize: 12,
        fontWeight: '500',
        textAlign: 'center',
    },
    indicator: {
        position: 'absolute',
        top: -12,
        width: 40,
        height: 3,
        borderRadius: 1.5,
    },
    addButtonContainer: {
        top: -28,
        zIndex: 10,
    },
    addButton: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.4,
        shadowRadius: 8,
        elevation: 10,
    },
});

export default TabBar;