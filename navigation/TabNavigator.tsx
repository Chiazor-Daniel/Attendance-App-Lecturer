import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';
import DashboardScreen from '../screens/DashboardScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import SyncScreen from '../screens/SyncScreen';
import ScheduleScreen from '../screens/ScheduleScreen';
import SettingsScreen from '../screens/SettingsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const TabIcon = ({ name, focused }: any) => {
  const getIconName = () => {
    switch (name) {
      case 'Home': return 'home';
      case 'Analytics': return 'analytics';
      case 'Sync': return 'sync';
      case 'Schedule': return 'calendar';
      case 'Settings': return 'settings';
      default: return 'home';
    }
  };
 
  return (
    <View style={styles.tabItem}>
      <Ionicons 
        name={getIconName()} 
        size={24}   
        color={focused ? '#8B5CF6' : '#6b7280'} 
        style={{ marginBottom: 4 }}
      />
      <Text style={[styles.tabText, focused && styles.tabTextActive]}>
        {name}
      </Text>
    </View>
  );
};


export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        tabBarIcon: ({ focused }) => (
          <TabIcon name={route.name} focused={focused} />
        ),
      })}
    >
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Sync" component={SyncScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    height: 80,
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIcon: {
    fontSize: 24,
    marginBottom: 4,
    opacity: 0.6,
  },
  tabIconActive: {
    opacity: 1,
  },
  tabText: {
    fontSize: 8,
    color: '#6b7280',
  },
  tabTextActive: {
    color: '#8B5CF6',
    fontWeight: '600',
  },
});