import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

// Placeholder components for screens
function CreateScreen() { return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Create Tournament</Text></View>; }
function FixturesScreen() { return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>League Fixtures</Text></View>; }
function StandingsScreen() { return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Standings</Text></View>; }
function KnockoutScreen() { return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}><Text>Knockout Bracket</Text></View>; }

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Create" component={CreateScreen} />
        <Tab.Screen name="Fixtures" component={FixturesScreen} />
        <Tab.Screen name="Standings" component={StandingsScreen} />
        <Tab.Screen name="Knockout" component={KnockoutScreen} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
