import React, { useCallback, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { FONTS } from './src/theme/fonts';
import { StatusBar, View } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import RandevuAnasayfa from './src/screens/RandevuAnasayfa';
import PolikliniklerScreen from './src/screens/PolikliniklerScreen';
import DoktorDetay from './src/screens/DoktorDetay';
import RandevularScreen from './src/screens/RandevularScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AmbulansCagirScreen from './src/screens/AmbulansCagirScreen';
import TumDoktorlarEkrani from './src/screens/TumDoktorlarEkrani';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#008B8B',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          height: 60,
          paddingHorizontal: 5,
          paddingTop: 5,
          paddingBottom: 5,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: FONTS.inter.medium,
          paddingBottom: 3,
        },
      }}
    >
      <Tab.Screen
        name='Home'
        component={PolikliniklerScreen}
        options={{
          tabBarLabel: 'Poliklinikler',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='home' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Randevu'
        component={RandevuAnasayfa}
        options={{
          tabBarLabel: 'Randevu',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='calendar-today' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='TumDoktorlarEkrani'
        component={TumDoktorlarEkrani}
        options={{
          tabBarLabel: 'Doktorlar',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='people' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Calendar'
        component={RandevularScreen}
        options={{
          tabBarLabel: 'Randevularım',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='calendar-today' size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name='person' size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter_18pt-Thin': require('./fonts/Inter/Inter_18pt-Thin.ttf'),
    'Inter_18pt-Regular': require('./fonts/Inter/Inter_18pt-Regular.ttf'),
    'Inter_18pt-Medium': require('./fonts/Inter/Inter_18pt-Medium.ttf'),
    'Inter_18pt-SemiBold': require('./fonts/Inter/Inter_18pt-SemiBold.ttf'),
    'Inter_18pt-Bold': require('./fonts/Inter/Inter_18pt-Bold.ttf'),
  });

  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
        await new Promise((resolve) => setTimeout(resolve, 3000));
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <StatusBar
          barStyle='dark-content'
          backgroundColor='#ffffff'
          translucent={false}
        />
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName='Welcome'
            screenOptions={{
              headerShown: false,
              contentStyle: {
                backgroundColor: '#ffffff',
              },
            }}
          >
            <Stack.Screen name='Welcome' component={WelcomeScreen} />
            <Stack.Screen name='Login' component={LoginScreen} />
            <Stack.Screen name='SignUp' component={SignUpScreen} />
            <Stack.Screen
              name='ForgotPassword'
              component={ForgotPasswordScreen}
            />
            <Stack.Screen name='MainApp' component={TabNavigator} />
            <Stack.Screen name='DoktorDetay' component={DoktorDetay} />
            <Stack.Screen name='Randevular' component={RandevularScreen} />
            <Stack.Screen
              name='AmbulansCagir'
              component={AmbulansCagirScreen}
            />
            <Stack.Screen
              name='TumDoktorlarEkrani'
              component={TumDoktorlarEkrani}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </GestureHandlerRootView>
  );
}
