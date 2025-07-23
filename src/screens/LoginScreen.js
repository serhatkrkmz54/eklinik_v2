import React, { useState, useContext, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
  Animated,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from '../components/BackButton'; // Geri tuşu için eklendi

import { loginUser } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

// --- FONKSİYONEL YAPI DEĞİŞMEDİ ---
const isValidTCKN = (tckn) => {
  if (typeof tckn !== 'string') {
    return false;
  }
  return /^[0-9]{11}$/.test(tckn);
};

const LoginScreen = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState({
    nationalId: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  // --- GELİŞMİŞ VE AKICI ANİMASYONLAR ---
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerTranslateY = useRef(new Animated.Value(20)).current;
  const tcknOpacity = useRef(new Animated.Value(0)).current;
  const tcknTranslateY = useRef(new Animated.Value(20)).current;
  const passwordOpacity = useRef(new Animated.Value(0)).current;
  const passwordTranslateY = useRef(new Animated.Value(20)).current;
  const footerOpacity = useRef(new Animated.Value(0)).current;
  const footerTranslateY = useRef(new Animated.Value(20)).current;

  const tcknFocusAnim = useRef(new Animated.Value(0)).current;
  const passwordFocusAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(headerTranslateY, { toValue: 0, bounciness: 5, useNativeDriver: true }),
      ]),
      Animated.parallel([
        // DÜZELTME: Input animasyonları artık JS tarafında çalışacak (useNativeDriver: false)
        Animated.timing(tcknOpacity, { toValue: 1, duration: 500, useNativeDriver: false }),
        Animated.spring(tcknTranslateY, { toValue: 0, bounciness: 5, useNativeDriver: false }),
      ]),
      Animated.parallel([
        // DÜZELTME: Input animasyonları artık JS tarafında çalışacak (useNativeDriver: false)
        Animated.timing(passwordOpacity, { toValue: 1, duration: 500, useNativeDriver: false }),
        Animated.spring(passwordTranslateY, { toValue: 0, bounciness: 5, useNativeDriver: false }),
      ]),
      Animated.parallel([
        Animated.timing(footerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.spring(footerTranslateY, { toValue: 0, bounciness: 5, useNativeDriver: true }),
      ]),
    ]);

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  const handleFocus = (inputType) => {
    setFocusedInput(inputType);
    const animToRun = inputType === 'nationalId' ? tcknFocusAnim : passwordFocusAnim;
    Animated.timing(animToRun, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  };
  const handleBlur = () => {
    const animToRun = focusedInput === 'nationalId' ? tcknFocusAnim : passwordFocusAnim;
    setFocusedInput(null);
    Animated.timing(animToRun, { toValue: 0, duration: 200, useNativeDriver: false }).start();
  };

  const tcknWrapperAnimatedStyle = {
    borderColor: tcknFocusAnim.interpolate({ inputRange: [0, 1], outputRange: ['#E2E8F0', '#008B8B'] }),
    shadowOpacity: tcknFocusAnim.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.1] }),
  };
  const passwordWrapperAnimatedStyle = {
    borderColor: passwordFocusAnim.interpolate({ inputRange: [0, 1], outputRange: ['#E2E8F0', '#008B8B'] }),
    shadowOpacity: passwordFocusAnim.interpolate({ inputRange: [0, 1], outputRange: [0.05, 0.1] }),
  };

  const tcknIconColor = focusedInput === 'nationalId' ? '#008B8B' : '#A0AEC0';
  const passwordIconColor = focusedInput === 'password' ? '#008B8B' : '#A0AEC0';


  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isFormValid = () => {
    return isValidTCKN(formData.nationalId) && formData.password.trim() !== '';
  };

  const handleLogin = async () => {
    if (!isFormValid() || loading) return;

    setLoading(true);
    let isLoginSuccessful = false;
    try {
      const response = await loginUser(formData.nationalId, formData.password);

      if (response?.accessToken) {
        isLoginSuccessful = true;
        setShowSuccessModal(true);
        setTimeout(() => {
          login(response.accessToken);
        }, 2000);
      } else {
        throw new Error('Giriş başarısız, lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Giriş sırasında detaylı hata:', JSON.stringify(error, null, 2));
      let errorMessage = 'Beklenmedik bir hata oluştu.';
      if (error && typeof error === 'object') {
        if (error.message && !error.errors) {
          errorMessage = error.message;
        } else if (error.errors && typeof error.errors === 'object') {
          const firstErrorKey = Object.keys(error.errors)[0];
          errorMessage = error.errors[firstErrorKey];
        }
      }
      Toast.show({
        type: 'error',
        text1: 'Giriş Hatası',
        text2: errorMessage,
      });
    } finally {
      if (!isLoginSuccessful) {
        setLoading(false);
      }
    }
  };

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle='dark-content' backgroundColor='#FFFFFF' />
        <LinearGradient
            colors={['#FFFFFF', '#F0F4F8']}
            style={styles.backgroundGradient}
        />
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
          <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
            <Modal
                transparent={true}
                visible={showSuccessModal}
                animationType="fade"
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.successIconWrapper}>
                    <MaterialIcons name="check" size={40} color="#FFFFFF" />
                  </View>
                  <Text style={styles.modalText}>Giriş Başarılı!</Text>
                  <Text style={styles.modalSubText}>Ana sayfaya yönlendiriliyorsunuz...</Text>
                </View>
              </View>
            </Modal>

            <View style={styles.backButtonContainer}>
              <BackButton />
            </View>

            <Animated.View style={[styles.header, { opacity: headerOpacity, transform: [{ translateY: headerTranslateY }] }]}>
              <Image source={require('../../assets/medics-logo.png')} style={styles.logo} />
              <Text style={styles.headerTitle}>Tekrar Hoş Geldiniz!</Text>
              <Text style={styles.headerSubtitle}>Lütfen bilgilerinizi girerek devam edin.</Text>
            </Animated.View>

            <View style={styles.formContainer}>
              <Animated.View style={[styles.inputWrapper, tcknWrapperAnimatedStyle, { opacity: tcknOpacity, transform: [{ translateY: tcknTranslateY }] }]}>
                <MaterialIcons name='badge' size={22} color={tcknIconColor} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder='T.C. Kimlik Numaranız'
                    placeholderTextColor='#A0AEC0'
                    keyboardType='numeric'
                    maxLength={11}
                    value={formData.nationalId}
                    onChangeText={(text) => handleInputChange('nationalId', text.replace(/[^0-9]/g, ''))}
                    onFocus={() => handleFocus('nationalId')}
                    onBlur={handleBlur}
                />
                {formData.nationalId.length > 0 && (
                    <MaterialIcons
                        name={isValidTCKN(formData.nationalId) ? 'check-circle' : 'error'}
                        size={22}
                        color={isValidTCKN(formData.nationalId) ? '#28A745' : '#DC3545'}
                    />
                )}
              </Animated.View>

              <Animated.View style={[styles.inputWrapper, passwordWrapperAnimatedStyle, { opacity: passwordOpacity, transform: [{ translateY: passwordTranslateY }] }]}>
                <MaterialIcons name='lock-outline' size={22} color={passwordIconColor} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder='Şifreniz'
                    secureTextEntry={!showPassword}
                    placeholderTextColor='#A0AEC0'
                    value={formData.password}
                    onChangeText={(text) => handleInputChange('password', text)}
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color='#A0AEC0'
                  />
                </TouchableOpacity>
              </Animated.View>

              <Animated.View style={{ opacity: passwordOpacity, transform: [{ translateY: passwordTranslateY }] }}>
                <TouchableOpacity
                    style={styles.forgotPassword}
                    onPress={() => navigation.navigate('ForgotPassword')}
                >
                  <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
                </TouchableOpacity>
              </Animated.View>
            </View>

            <Animated.View style={[styles.footer, { opacity: footerOpacity, transform: [{ translateY: footerTranslateY }] }]}>
              <TouchableOpacity
                  onPress={handleLogin}
                  disabled={!isFormValid() || loading}
                  activeOpacity={0.8}
                  style={[styles.loginButton, (!isFormValid() || loading) && styles.loginButtonDisabled]}
              >
                {loading ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                    <Text style={styles.loginButtonText}>Giriş Yap</Text>
                )}
              </TouchableOpacity>

              <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>Hesabınız yok mu? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                  <Text style={styles.signUpLink}>Hemen Kayıt Olun</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
        <Toast />
      </SafeAreaView>
  );
};

// --- YENİ VE MODERN STİLLER ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start', // DEĞİŞİKLİK: İçeriği ortalamak yerine yukarıya yasladık.
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButtonContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 20 : 30,
    left: 20,
    zIndex: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30, // DEĞİŞİKLİK: Formu başlığa yaklaştırmak için 40'tan 30'a düşürüldü.
    marginTop: 50, // DEĞİŞİKLİK: Tüm içeriği yukarı taşımak için 60'tan 50'ye düşürüldü.
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: FONTS.inter.bold,
    color: '#1A202C',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: FONTS.inter.regular,
    color: '#718096',
    textAlign: 'center',
  },
  formContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    shadowColor: '#2D3748',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#1A202C',
    fontSize: 16,
    fontFamily: FONTS.inter.regular,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
  },
  forgotPasswordText: {
    color: '#008B8B',
    fontSize: 14,
    fontFamily: FONTS.inter.medium,
  },
  footer: {
    paddingBottom: 20,
  },
  loginButton: {
    backgroundColor: '#008B8B', // Gradient yerine düz renk
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#008B8B',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  loginButtonDisabled: { // Pasif durum için yeni stil
    backgroundColor: '#A0AEC0',
    shadowOpacity: 0,
    elevation: 0,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FONTS.inter.semiBold,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signUpText: {
    color: '#718096',
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
  },
  signUpLink: {
    color: '#008B8B',
    fontFamily: FONTS.inter.semiBold,
    fontSize: 14,
    marginLeft: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    width: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  successIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#28A745',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    fontFamily: FONTS.inter.bold,
    color: '#1A202C',
    marginTop: 24,
  },
  modalSubText: {
    fontSize: 15,
    fontFamily: FONTS.inter.regular,
    color: '#718096',
    marginTop: 8,
  },
});

export default LoginScreen;
