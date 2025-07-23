import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, StatusBar, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../theme/fonts';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; // DÜZELTME: Güvenli alanları manuel kontrol için eklendi

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets(); // DÜZELTME: Cihazın güvenli alan boşluklarını alıyoruz

  // --- GİRİŞ ANİMASYONLARI ---
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);


  return (
      <View style={styles.container}>
        <StatusBar barStyle='dark-content' backgroundColor='transparent' translucent />
        <LinearGradient
            colors={['#008B8B', '#006C6C']}
            style={StyleSheet.absoluteFill}
        />

        <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
          <View style={styles.contentContainer}>
            <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
              <Image
                  source={require('../../assets/medics-logo.png')}
                  style={styles.logo}
                  resizeMode='contain'
              />
              <Text style={styles.title}>E-Klinik'e Hoş Geldiniz</Text>
              <Text style={styles.subtitle}>
                Sağlığınız için randevu almanın en kolay ve en hızlı yolu.
              </Text>
            </Animated.View>
          </View>

          <Animated.View style={[styles.buttonContainer, { opacity: fadeAnim }]}>
            <TouchableOpacity
                style={styles.ambulanceButton}
                onPress={() => navigation.navigate('AmbulansCagir')}
                activeOpacity={0.8}
            >
              <MaterialIcons name="emergency" size={24} color="#FF4444" />
              <Text style={styles.ambulanceButtonText}>Acil Ambulans Çağır</Text>
            </TouchableOpacity>

            <View style={styles.authButtonsWrapper}>
              <TouchableOpacity
                  style={styles.loginButton}
                  onPress={() => navigation.navigate('Login')}
                  activeOpacity={0.8}
              >
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
              </TouchableOpacity>

              <TouchableOpacity
                  style={styles.signUpButton}
                  onPress={() => navigation.navigate('SignUp')}
                  activeOpacity={0.8}
              >
                <Text style={styles.signUpButtonText}>Kayıt Ol</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 140,
    height: 140,
    marginBottom: 30,
    alignSelf: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: FONTS.inter.bold,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.inter.regular,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  ambulanceButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  ambulanceButtonText: {
    color: '#FF4444',
    fontSize: 16,
    fontFamily: FONTS.inter.bold,
    marginLeft: 10,
  },
  authButtonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loginButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 16,
    borderRadius: 16,
    marginRight: 10,
  },
  signUpButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 16,
    marginLeft: 10,
  },
  loginButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.inter.semiBold,
  },
  signUpButtonText: {
    color: '#008B8B',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.inter.semiBold,
  },
});

export default WelcomeScreen;
