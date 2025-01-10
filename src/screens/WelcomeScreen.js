import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../theme/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';

const WelcomeScreen = () => {
  const navigation = useNavigation();

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

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require('../../assets/medics-logo.png')}
          style={styles.logo}
          resizeMode='contain'
        />
        <Text style={styles.title}>E-KLİNİK RANDEVU SİSTEMİ</Text>
        <Text style={styles.subtitle}>
          Randevu almak için lütfen giriş yapınız. Kaydınız yoksa lütfen kayıt
          olunuz. Yada hastane ile iletişime geçiniz.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.ambulanceButton}
          onPress={() => navigation.navigate('AmbulansCagir')}
        >
          <Text style={styles.ambulanceButtonText}>Ambulans Çağır</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginButtonText}>Giriş Yap</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={() => navigation.navigate('SignUp')}
        >
          <Text style={styles.signUpButtonText}>Kayıt Ol</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    tintColor: '#008B8B',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
  },
  ambulanceButton: {
    backgroundColor: '#FF4444',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  ambulanceButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.inter.semiBold,
  },
  loginButton: {
    backgroundColor: '#008B8B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 15,
  },
  signUpButton: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#008B8B',
  },
  loginButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontFamily: FONTS.inter.semiBold,
  },
  signUpButtonText: {
    color: '#008B8B',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.inter.semiBold,
  },
});

export default WelcomeScreen;
