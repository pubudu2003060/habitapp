import React, { useContext } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { useLinkBuilder, useTheme, DarkTheme } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ThemeContext } from '../../theme/ThemeProvider';


function TabBar({ state, descriptors, navigation }: { state: any; descriptors: Record<string, any>; navigation: any }) {

    const { buildHref } = useLinkBuilder();

    const { colors } = useContext(ThemeContext);

    const styles = StyleSheet.create({
        container: {
            position: 'static',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: colors.background.toString(),
        },
        tabBar: {
            flexDirection: 'row',
            height: 70,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            shadowColor: colors.primary.toString(),
            shadowOpacity: 0.1,
            elevation: 5,
            paddingHorizontal: 8,
            alignContent: 'center',
            backgroundColor: colors.background.toString(), 
        },
        tabButton: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'transparent',
        },
        addButtonContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        addButton: {
            width: 52,
            height: 52,
            borderRadius: 26,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 24,
            backgroundColor: colors.accent.toString(),
            shadowColor: colors.primary.toString(),
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.3,
            shadowRadius: 3,
            elevation: 5,
        },
    });


    return (
        <SafeAreaView edges={['bottom']} style={styles.container}>
            <View style={styles.tabBar}>
                {state.routes.map((route: any, index: number) => {
                    const { options } = descriptors[route.key];

                    const isFocused = state.index === index;

                    let name = "";

                    switch (route.name) {
                        case 'Home':
                            name = 'home';
                            break;
                        case 'Explore':
                            name = 'compass';
                            break;
                        case 'Add':
                            name = 'plus-circle';
                            break;
                        case 'Stat':
                            name = 'bar-chart';
                            break;
                        case 'Profile':
                            name = 'user-circle';
                            break;
                        default:
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
                                <View style={styles.addButton}>
                                    <Icon name={name} size={30}  />
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
                            <Icon name={name} size={30}  />
                        </PlatformPressable>
                    );
                })}
            </View>
        </SafeAreaView>
    );
}



export default TabBar;