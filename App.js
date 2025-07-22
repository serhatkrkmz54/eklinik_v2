import React, {useCallback, useContext, useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import { FONTS } from './src/theme/fonts';
import {ActivityIndicator, StatusBar, View} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { AuthContext, AuthProvider } from './src/context/AuthContext';
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
import TumDoktorlarEkrani from './src/screens/DoktorlarScreen';
import EditProfileScreen from "./src/screens/EditProfileScreen";
import DoktorlarScreen from "./src/screens/DoktorlarScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const insets = useSafeAreaInsets();

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: '#008B8B',
                tabBarInactiveTintColor: '#666',
                tabBarStyle: {
                    height: 60 + insets.bottom,
                    paddingBottom: insets.bottom,
                    paddingTop: 5,
                    paddingHorizontal: 5,
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#f0f0f0',
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
                },
            }}
        >
            <Tab.Screen
                name='Poliklinikler'
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
            {/*<Tab.Screen*/}
            {/*    name='TumDoktorlarEkrani'*/}
            {/*    component={TumDoktorlarEkrani}*/}
            {/*    options={{*/}
            {/*        tabBarLabel: 'Doktorlar',*/}
            {/*        tabBarIcon: ({ color, size }) => (*/}
            {/*            <MaterialIcons name='people' size={size} color={color} />*/}
            {/*        ),*/}
            {/*    }}*/}
            {/*/>*/}
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
const AppStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainApp" component={TabNavigator} />
        <Stack.Screen name="Doktorlar" component={DoktorlarScreen} />
        <Stack.Screen name="DoktorDetay" component={DoktorDetay} />
        <Stack.Screen name='Randevular' component={RandevularScreen} />
        <Stack.Screen
            name='AmbulansCagir'
            component={AmbulansCagirScreen}
        />
        <Stack.Screen
            name='TumDoktorlarEkrani'
            component={TumDoktorlarEkrani}
        />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
);

const AuthStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="AmbulansCagir" component={AmbulansCagirScreen} />
    </Stack.Navigator>
);

const AppRouter = () => {
    const { userToken, isLoading } = useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#008B8B" />
            </View>
        );
    }

    return (
        <NavigationContainer>
            {userToken ? <AppStack /> : <AuthStack />}
        </NavigationContainer>
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
        SplashScreen.preventAutoHideAsync();
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
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
                <AuthProvider>
                    <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
                    <AppRouter />
                    <Toast />
                </AuthProvider>
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
