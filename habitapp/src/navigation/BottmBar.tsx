
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home.screen';
import Profile from '../screens/Profile.screen';
import TabBar from '../components/TabBar';
import Add from '../screens/Add.screen';
import Stat from '../screens/Stat.screen';
import Explore from '../screens/Explore.screen';


const Tab = createBottomTabNavigator();

export default function MyTabs() {
    return (
        <NavigationContainer>
            <Tab.Navigator
                tabBar={(props) => <TabBar {...props} />}
            >
                <Tab.Screen name="Home" component={Home} />
                <Tab.Screen name="Explore" component={Explore} />
                <Tab.Screen name="Add" component={Add} />
                <Tab.Screen name="Stat" component={Stat} />
                <Tab.Screen name="Profile" component={Profile} />
            </Tab.Navigator>
        </NavigationContainer>

    );
}