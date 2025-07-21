import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator, Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import BackButton from '../components/BackButton';
import { FONTS } from '../theme/fonts';
import BackgroundLogo from '../components/BackgroundLogo';
import Toast from 'react-native-toast-message';

import { loginUser } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

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

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getTCKNValidationStyle = () => {
    if (formData.nationalId.length === 0) return styles.inputWrapper;
    return isValidTCKN(formData.nationalId)
        ? [styles.inputWrapper, styles.validInput]
        : [styles.inputWrapper, styles.invalidInput];
  };

  const isFormValid = () => {
    return (
        isValidTCKN(formData.nationalId) &&
        formData.password.trim() !== ''
    );
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
        <StatusBar barStyle='dark-content' backgroundColor='#fff' />
        <Modal
            transparent={true}
            visible={showSuccessModal}
            animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color="#008B8B" />
              <Text style={styles.modalText}>Giriş başarılı!</Text>
              <Text style={styles.modalSubText}>Yönlendiriliyorsunuz...</Text>
            </View>
          </View>
        </Modal>

        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>Giriş Yap</Text>
          <View style={styles.placeholder} />
        </View>
        <View style={styles.mainContent}>
          <BackgroundLogo />
          <View style={styles.inputContainer}>
            <View style={getTCKNValidationStyle()}>
              <MaterialIcons
                  name='badge'
                  size={20}
                  color={
                    formData.nationalId.length > 0
                        ? isValidTCKN(formData.nationalId)
                            ? '#4CAF50'
                            : '#FF5252'
                        : '#666'
                  }
                  style={styles.inputIcon}
              />
              <TextInput
                  style={styles.input}
                  placeholder='T.C. Kimlik Numaranız'
                  placeholderTextColor='#666'
                  keyboardType='numeric'
                  maxLength={11}
                  value={formData.nationalId}
                  onChangeText={(text) => handleInputChange('nationalId', text.replace(/[^0-9]/g, ''))}
              />
              {formData.nationalId.length > 0 && (
                  <MaterialIcons
                      name={isValidTCKN(formData.nationalId) ? 'check-circle' : 'error'}
                      size={20}
                      color={isValidTCKN(formData.nationalId) ? '#4CAF50' : '#FF5252'}
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
            {loading ? (
                <ActivityIndicator size="small" color="#fff" />
            ) : (
                <Text style={styles.loginButtonText}>Giriş Yap</Text>
            )}
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
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: '#A9A9A9',
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    width: '80%',
  },
  modalText: {
    fontSize: 18,
    fontFamily: FONTS.inter.semiBold,
    marginTop: 20,
  },
  modalSubText: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    color: '#666',
    marginTop: 5,
  },
});

export default LoginScreen;
