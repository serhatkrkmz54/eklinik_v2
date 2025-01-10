import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import BackButton from '../components/BackButton';
import { FONTS } from '../theme/fonts';
import BackgroundLogo from '../components/BackgroundLogo';
import { isValidEmail } from '../utils/validation';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          // Token varsa direkt ana sayfaya yönlendir
          navigation.replace('MainApp');
        }
      } catch (err) {
        // Hata durumunda token'ı temizle
        await AsyncStorage.removeItem('userToken');
      }
    };

    checkToken();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const checkAuth = async () => {
        try {
          const token = await AsyncStorage.getItem('userToken');
          if (token) {
            // Token varsa ana sayfaya yönlendir
            navigation.reset({
              index: 0,
              routes: [{ name: 'MainApp' }],
            });
          }
        } catch (err) {
          // Hata durumunda token'ı temizle
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('tokenTimestamp');
        }
      };

      checkAuth();
    }, [navigation])
  );

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getEmailValidationStyle = () => {
    if (formData.email.length === 0) return styles.inputWrapper;
    return isValidEmail(formData.email)
      ? [styles.inputWrapper, styles.validInput]
      : [styles.inputWrapper, styles.invalidInput];
  };

  const isFormValid = () => {
    return (
      formData.email.trim() !== '' &&
      isValidEmail(formData.email) &&
      formData.password.trim() !== ''
    );
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        'http://10.121.242.101:8000/api/login',
        {
          email: formData.email,
          password: formData.password,
        }
      );

      if (response.data?.token) {
        console.log('Giriş başarılı! Token:', response.data.token);

        // Token'ı kaydet
        await AsyncStorage.setItem('userToken', response.data.token);

        Toast.show({
          type: 'success',
          text1: 'Başarılı',
          text2: 'Giriş başarılı! Yönlendiriliyorsunuz...',
          position: 'top',
          visibilityTime: 2000,
        });

        setFormData({
          email: '',
          password: '',
        });

        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: 'MainApp' }],
          });
        }, 2000);
      }
    } catch (err) {
      console.error('Giriş hatası:', err.response?.data);
      let errorMessage = 'Giriş yapılırken bir hata oluştu';

      if (err.response?.data?.message === 'Invalid credentials') {
        errorMessage = 'E-posta veya şifre hatalı';
      }

      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#fff' />
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Giriş Yap</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.mainContent}>
        <BackgroundLogo />
        <View style={styles.inputContainer}>
          <View style={getEmailValidationStyle()}>
            <MaterialIcons
              name='email'
              size={20}
              color={
                formData.email.length > 0
                  ? isValidEmail(formData.email)
                    ? '#4CAF50'
                    : '#FF5252'
                  : '#666'
              }
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder='E-posta Adresiniz'
              placeholderTextColor='#666'
              keyboardType='email-address'
              autoCapitalize='none'
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
            {formData.email.length > 0 && (
              <MaterialIcons
                name={isValidEmail(formData.email) ? 'check-circle' : 'error'}
                size={20}
                color={isValidEmail(formData.email) ? '#4CAF50' : '#FF5252'}
              />
            )}
          </View>

          <View style={styles.inputWrapper}>
            <MaterialIcons
              name='lock'
              size={20}
              color='#666'
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder='Şifreniz'
              secureTextEntry={!showPassword}
              placeholderTextColor='#666'
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color='#666'
                style={styles.eyeIcon}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.forgotPassword}
            onPress={() => navigation.navigate('ForgotPassword')}
          >
            <Text style={styles.forgotPasswordText}>Şifremi Unuttum?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.loginButton,
            (!isFormValid() || loading) && styles.loginButtonDisabled,
          ]}
          onPress={handleLogin}
          disabled={!isFormValid() || loading}
        >
          <Text style={styles.loginButtonText}>
            {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
          </Text>
        </TouchableOpacity>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Hesabınız yok mu? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.signUpLink}>Kayıt Olun</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  backButton: {
    padding: 10,
    marginLeft: -10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: FONTS.inter.semiBold,
  },
  placeholder: {
    width: 34,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: 14,
  },
  characterCount: {
    color: '#666',
    fontSize: 12,
    marginLeft: 10,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  forgotPasswordText: {
    color: '#008B8B',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#008B8B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    height: 55,
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.poppins.semiBold,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signUpText: {
    color: '#666',
    fontSize: 14,
  },
  signUpLink: {
    color: '#008B8B',
    fontWeight: '600',
    fontSize: 14,
  },
  validInput: {
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  invalidInput: {
    borderWidth: 1,
    borderColor: '#FF5252',
  },
});

export default LoginScreen;
