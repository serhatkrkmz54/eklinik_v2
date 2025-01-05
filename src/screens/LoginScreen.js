import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, StatusBar, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import BackButton from '../components/BackButton';
import { FONTS } from '../theme/fonts';
import BackgroundLogo from '../components/BackgroundLogo';
import SuccessModal from '../components/SuccessModal';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [tcKimlik, setTcKimlik] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleTcKimlikChange = (text) => {
    const numericValue = text.replace(/[^0-9]/g, '');
    if (numericValue.length <= 11) {
      setTcKimlik(numericValue);
    }
  };

  const handleLogin = () => {
    if (tcKimlik === '48610685828' && password === '123456') {
      setLoading(true);
      setShowSuccessModal(true);
      setTimeout(() => {
        setShowSuccessModal(false);
        navigation.replace('MainApp');
      }, 3000);
    } else {
      Alert.alert(
        "Giriş Başarısız",
        "TC Kimlik numarası veya şifre hatalı. Lütfen bilgilerinizi kontrol ediniz.",
        [
          { text: "Tamam", style: "cancel" }
        ]
      );
    }
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigation.replace('MainApp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Giriş Yap</Text>
        <View style={styles.placeholder} />
      </View>
      <View style={styles.mainContent}>
        <BackgroundLogo />
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="person" size={18} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="TC Kimlik numaranızı giriniz"
              placeholderTextColor="#666"
              value={tcKimlik}
              onChangeText={handleTcKimlikChange}
              keyboardType="numeric"
              maxLength={11}
            />
            {tcKimlik.length > 0 && (
              tcKimlik.length === 11 ? (
                <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              ) : (
                <Text style={styles.characterCount}>{tcKimlik.length}/11</Text>
              )
            )}
          </View>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="lock" size={18} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Şifrenizi giriniz"
              secureTextEntry={!showPassword}
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={20} 
                color="#666" 
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
            loading && styles.loginButtonDisabled
          ]} 
          onPress={handleLogin}
          disabled={loading || tcKimlik.length !== 11 || !password}
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

      <SuccessModal 
        visible={showSuccessModal}
        onClose={handleSuccessModalClose}
      />
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
});

export default LoginScreen; 