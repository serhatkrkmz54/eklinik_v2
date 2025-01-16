import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../components/BackButton';
import { FONTS } from '../theme/fonts';
import { isValidEmail } from '../utils/validation';
import BackgroundLogo from '../components/BackgroundLogo';
import axios from 'axios';
import Toast from 'react-native-toast-message';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendEmail = async () => {
    if (!isValidEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: 'Lütfen geçerli bir e-posta adresi girin',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'http://132.226.194.153/api/forgot-password',
        {
          email: email,
        }
      );

      Toast.show({
        type: 'success',
        text1: 'Başarılı',
        text2: 'Şifre sıfırlama bağlantısı e-posta adresinize gönderildi',
        position: 'top',
        visibilityTime: 3000,
      });

      setTimeout(() => {
        navigation.navigate('Login');
      }, 3000);
    } catch (error) {
      console.error('Şifre sıfırlama hatası:', error.response?.data);
      let errorMessage = 'Şifre sıfırlama işlemi sırasında bir hata oluştu';

      if (error.response?.data?.errors?.email) {
        errorMessage = error.response.data.errors.email[0];
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

  const getEmailValidationStyle = () => {
    if (email.length === 0) return styles.inputWrapper;
    return isValidEmail(email)
      ? [styles.inputWrapper, styles.validInput]
      : [styles.inputWrapper, styles.invalidInput];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#fff' />
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Şifremi Unuttum</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.mainContent}>
        <BackgroundLogo />
        <Text style={styles.description}>
          Şifrenizi sıfırlamak için e-posta adresinizi girin. Size şifre
          sıfırlama bağlantısı göndereceğiz.
        </Text>

        <View style={styles.inputContainer}>
          <View style={getEmailValidationStyle()}>
            <MaterialIcons
              name='email'
              size={20}
              color={
                email.length > 0
                  ? isValidEmail(email)
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
              value={email}
              onChangeText={setEmail}
            />
            {email.length > 0 && (
              <MaterialIcons
                name={isValidEmail(email) ? 'check-circle' : 'error'}
                size={20}
                color={isValidEmail(email) ? '#4CAF50' : '#FF5252'}
              />
            )}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            (!isValidEmail(email) || loading) && styles.sendButtonDisabled,
          ]}
          onPress={handleSendEmail}
          disabled={!isValidEmail(email) || loading}
        >
          <Text style={styles.sendButtonText}>
            {loading ? 'Gönderiliyor...' : 'Sıfırlama Bağlantısı Gönder'}
          </Text>
        </TouchableOpacity>
      </View>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.inter.semiBold,
    color: '#000',
  },
  placeholder: {
    width: 34,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    fontFamily: FONTS.inter.regular,
  },
  inputContainer: {
    marginBottom: 30,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
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
    fontFamily: FONTS.inter.regular,
  },
  validInput: {
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  invalidInput: {
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  sendButton: {
    backgroundColor: '#008B8B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
  sendButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.inter.semiBold,
  },
});

export default ForgotPasswordScreen;
