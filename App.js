import React, {useCallback, useContext, useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {MaterialIcons} from '@expo/vector-icons';
import {useFonts} from 'expo-font';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Toast from 'react-native-toast-message';
import {SafeAreaProvider, useSafeAreaInsets} from 'react-native-safe-area-context';
import {AuthContext, AuthProvider} from './src/context/AuthContext';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import PolikliniklerScreen from './src/screens/PolikliniklerScreen';
import DoktorDetay from './src/screens/DoktorDetay';
import RandevularScreen from './src/screens/RandevularScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import AmbulansCagirScreen from './src/screens/AmbulansCagirScreen';
import TumDoktorlarEkrani from './src/screens/DoktorlarScreen';
import DoktorlarScreen from './src/screens/DoktorlarScreen';
import EditProfileScreen from "./src/screens/EditProfileScreen";
// --- ADDED: Import the new screen ---
import AppointmentDetailScreen from "./src/screens/AppointmentDetailScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
    const tabBarWidth = Dimensions.get('window').width - 40;
    const tabWidth = tabBarWidth / state.routes.length;
    const indicatorWidth = 50;
    const animatedValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const toValue = state.index * tabWidth + (tabWidth - indicatorWidth) / 2;
        Animated.spring(animatedValue, {
            toValue: toValue,
            useNativeDriver: true,
            bounciness: 8,
        }).start();
    }, [state.index, tabWidth]);

    return (
        <View style={styles.tabBarContainer}>
            <Animated.View style={[styles.activeTabIndicator, { width: indicatorWidth, transform: [{ translateX: animatedValue }] }]} />
            {state.routes.map((route, index) => {
                const { options } = descriptors[route.key];
                const label = options.tabBarLabel !== undefined ? options.tabBarLabel : route.name;
                const isFocused = state.index === index;
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
                const Icon = (props) => options.tabBarIcon({ ...props, focused: isFocused });
                return (
                    <TouchableOpacity
                        key={route.key}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        onPress={onPress}
                        style={styles.tabItem}
                    >
                        <Icon size={26} color={isFocused ? '#008B8B' : '#A0AEC0'} />
                        <Text style={[styles.tabLabel, { color: isFocused ? '#008B8B' : '#A0AEC0' }]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const TabNavigator = () => {
    return (
        <Tab.Navigator
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
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
            {/* --- UPDATED: This tab now points to the same RandevularScreen --- */}
            <Tab.Screen
                name='MedicalRecords'
                component={RandevularScreen}
                options={{
                    tabBarLabel: 'Kayıtlarım',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialIcons name='folder-copy' size={size} color={color} />
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

const AppStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainApp" component={TabNavigator} />
        <Stack.Screen name="Doktorlar" component={DoktorlarScreen} />
        <Stack.Screen name="DoktorDetay" component={DoktorDetay} />
        <Stack.Screen name='Randevular' component={RandevularScreen} />
        <Stack.Screen name='AmbulansCagir' component={AmbulansCagirScreen} />
        <Stack.Screen name='TumDoktorlarEkrani' component={TumDoktorlarEkrani} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        {/* --- ADDED: The new detail screen to the stack --- */}
        <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
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
    const insets = useSafeAreaInsets();
    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#008B8B" />
            </View>
        );
    }
    return (
        <View style={{ flex: 1, paddingTop: insets.top }}>
            <NavigationContainer>
                {userToken ? <AppStack /> : <AuthStack />}
            </NavigationContainer>
        </View>
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

const styles = StyleSheet.create({
    tabBarContainer: {
        flexDirection: 'row',
        height: 85,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        borderRadius: 20,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    tabItem: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
    },
    tabLabel: {
        fontSize: 12,
        marginTop: 4,
        fontFamily: 'Inter_18pt-Medium',
    },
    activeTabIndicator: {
        position: 'absolute',
        top: 6,
        height: 4,
        backgroundColor: '#008B8B',
        borderRadius: 2,
    },
});