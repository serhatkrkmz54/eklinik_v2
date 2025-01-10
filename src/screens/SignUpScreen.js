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
  Modal,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import BackButton from '../components/BackButton';
import { isValidEmail } from '../utils/validation';
import { FONTS } from '../theme/fonts';
import BackgroundLogo from '../components/BackgroundLogo';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tcKimlik: '',
    email: '',
    phone: '',
    password: '',
    password_confirmation: '',
    agreeToTerms: false,
    gender: 'none',
    birth_date: new Date(),
  });

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

  const formatPhoneNumber = (text) => {
    const numbers = text.replace(/[^\d]/g, '');

    if (numbers.length <= 3) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)} - ${numbers.slice(
        6
      )}`;
    }
    return numbers;
  };

  const handleInputChange = (field, value) => {
    if (field === 'tcKimlik') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 11) {
        setFormData((prev) => ({ ...prev, [field]: numericValue }));
      }
    } else if (field === 'phone') {
      const numericValue = value.replace(/[^\d]/g, '');
      if (numericValue.length <= 10) {
        const formattedNumber = formatPhoneNumber(numericValue);
        setFormData((prev) => ({ ...prev, [field]: formattedNumber }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
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
      formData.password.trim() !== '' &&
      formData.password_confirmation.trim() !== '' &&
      formData.password === formData.password_confirmation &&
      formData.name.trim() !== '' &&
      formData.tcKimlik.trim().length === 11 &&
      formData.phone.trim() !== '' &&
      formData.agreeToTerms
    );
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        birth_date: selectedDate,
      }));
    }
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const handleSignUp = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await axios.post(
        'http://10.121.242.101:8000/api/register',
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          password_confirmation: formData.password,
          tckn: formData.tcKimlik,
          phoneNumber: formData.phone.replace(/[^0-9]/g, ''),
          gender: formData.gender,
          birth_date: formatDate(formData.birth_date),
        }
      );

      if (response.data) {
        console.log('Kayıt başarılı! Token:', response.data.token);
        await AsyncStorage.setItem('userToken', response.data.token);

        // Form verilerini sıfırla
        setFormData({
          name: '',
          tcKimlik: '',
          email: '',
          phone: '',
          password: '',
          password_confirmation: '',
          agreeToTerms: false,
          gender: 'none',
          birth_date: new Date(),
        });

        Toast.show({
          type: 'success',
          text1: 'Başarılı',
          text2:
            'Kayıt işlemi başarıyla tamamlandı. Giriş sayfasına yönlendiriliyorsunuz.',
          position: 'top',
          visibilityTime: 3000,
        });

        setTimeout(() => {
          navigation.navigate('Login');
        }, 3000);
      }
    } catch (err) {
      console.error('Kayıt hatası:', err.response?.data);
      let errorMessages = [];

      if (err.response?.data?.errors) {
        const errors = err.response.data.errors;

        if (errors.email) {
          errorMessages.push(errors.email[0]);
        }

        if (errors.password) {
          errorMessages.push(errors.password[0]);
        }

        if (errors.tckn) {
          errorMessages.push(errors.tckn[0]);
        }
      }
      if (errorMessages.length === 0) {
        errorMessages.push('Kayıt işlemi sırasında bir hata oluştu');
      }

      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: errorMessages.join('\n'),
        position: 'top',
        visibilityTime: 4000,
      });

      setError(errorMessages.join('\n'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#fff' />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 40}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          keyboardShouldPersistTaps='handled'
          keyboardDismissMode='on-drag'
        >
          <View style={styles.header}>
            <BackButton />
            <Text style={styles.headerTitle}>Kayıt Ol</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={[styles.mainContent, { paddingTop: 0 }]}>
            <BackgroundLogo style={{ height: 120 }} />
            <View style={styles.inputContainer}>
              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name='person'
                  size={20}
                  color='#666'
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Ad Soyad'
                  placeholderTextColor='#666'
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                />
              </View>

              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name='credit-card'
                  size={20}
                  color='#666'
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder='TC Kimlik Numarası'
                  placeholderTextColor='#666'
                  keyboardType='numeric'
                  maxLength={11}
                  value={formData.tcKimlik}
                  onChangeText={(text) => handleInputChange('tcKimlik', text)}
                />
                {formData.tcKimlik.length > 0 &&
                  (formData.tcKimlik.length === 11 ? (
                    <MaterialIcons
                      name='check-circle'
                      size={20}
                      color='#4CAF50'
                    />
                  ) : (
                    <Text style={styles.characterCount}>
                      {formData.tcKimlik.length}/11
                    </Text>
                  ))}
              </View>

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
                  placeholder='E-posta Adresi'
                  placeholderTextColor='#666'
                  keyboardType='email-address'
                  autoCapitalize='none'
                  value={formData.email}
                  onChangeText={(text) => handleInputChange('email', text)}
                />
                {formData.email.length > 0 && (
                  <MaterialIcons
                    name={
                      isValidEmail(formData.email) ? 'check-circle' : 'error'
                    }
                    size={20}
                    color={isValidEmail(formData.email) ? '#4CAF50' : '#FF5252'}
                  />
                )}
              </View>

              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name='phone'
                  size={20}
                  color='#666'
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder='Telefon Numarası'
                  placeholderTextColor='#666'
                  keyboardType='numeric'
                  value={formData.phone}
                  onChangeText={(text) => handleInputChange('phone', text)}
                />
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
                  placeholder='Şifre'
                  secureTextEntry={!showPassword}
                  placeholderTextColor='#666'
                  value={formData.password}
                  onChangeText={(text) => handleInputChange('password', text)}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color='#666'
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
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
                  placeholder='Şifre Onay'
                  secureTextEntry={!showPassword}
                  placeholderTextColor='#666'
                  value={formData.password_confirmation}
                  onChangeText={(text) =>
                    handleInputChange('password_confirmation', text)
                  }
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color='#666'
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <MaterialIcons
                  name='person'
                  size={20}
                  color='#666'
                  style={styles.inputIcon}
                />
                <Picker
                  selectedValue={formData.gender}
                  style={styles.picker}
                  onValueChange={(value) => handleInputChange('gender', value)}
                  dropdownIconColor='#666'
                >
                  <Picker.Item label='Cinsiyet Seçin' value='none' />
                  <Picker.Item label='Erkek' value='male' />
                  <Picker.Item label='Kadın' value='female' />
                </Picker>
              </View>

              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowDatePicker(true)}
              >
                <MaterialIcons
                  name='calendar-today'
                  size={20}
                  color='#666'
                  style={styles.inputIcon}
                />
                <Text style={styles.dateButtonText}>
                  Doğum Tarihi: {formatDate(formData.birth_date)}
                </Text>
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={formData.birth_date}
                  mode='date'
                  display='default'
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}

              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() =>
                    handleInputChange('agreeToTerms', !formData.agreeToTerms)
                  }
                >
                  {formData.agreeToTerms && (
                    <MaterialIcons name='check' size={16} color='#008B8B' />
                  )}
                </TouchableOpacity>
                <View style={styles.termsTextContainer}>
                  <Text style={styles.termsText}>
                    Kullanım koşullarını{' '}
                    <Text
                      style={styles.termsLink}
                      onPress={() => setShowTerms(true)}
                    >
                      kabul ediyorum
                    </Text>
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.signUpButton,
                (!isFormValid() || loading) && styles.signUpButtonDisabled,
              ]}
              disabled={!isFormValid() || loading}
              onPress={handleSignUp}
            >
              <Text style={styles.signUpButtonText}>
                {loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
              </Text>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Giriş Yap</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal kısmı burası - Kullanım koşullarını kabul ediyorum kısmı */}
      <Modal
        animationType='slide'
        transparent={true}
        visible={showTerms}
        onRequestClose={() => setShowTerms(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kullanım Koşulları</Text>
              <TouchableOpacity onPress={() => setShowTerms(false)}>
                <MaterialIcons name='close' size={24} color='#000' />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>
                1. Gizlilik ve Güvenlik{'\n\n'}
                Kişisel verileriniz güvenli bir şekilde saklanacak ve üçüncü
                taraflarla paylaşılmayacaktır.{'\n\n'}
                2. Hizmet Kullanımı{'\n\n'}
                Sistemimiz üzerinden randevu alırken doğru ve güncel bilgiler
                kullanmanız gerekmektedir.{'\n\n'}
                3. Sorumluluklar{'\n\n'}
                Randevunuza gelemeyecekseniz en az 24 saat öncesinden iptal
                etmeniz gerekmektedir.{'\n\n'}
                4. İletişim{'\n\n'}
                Sistemle ilgili tüm sorunlarınızı destek ekibimize
                bildirebilirsiniz.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* Modal kısmı burası - Kullanım koşullarını kabul ediyorum kısmı */}
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 20,
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
    fontFamily: FONTS.inter.semiBold,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  placeholder: {
    width: 34,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#008B8B',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  termsTextContainer: {
    flex: 1,
  },
  termsText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#008B8B',
    textDecorationLine: 'underline',
  },
  signUpButton: {
    backgroundColor: '#008B8B',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    height: 55,
    justifyContent: 'center',
  },
  signUpButtonDisabled: {
    backgroundColor: '#ccc',
  },
  signUpButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontFamily: FONTS.poppins.semiBold,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 70,
  },
  loginText: {
    color: '#666',
    fontSize: 16,
  },
  loginLink: {
    color: '#008B8B',
    fontWeight: '600',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    color: '#000',
  },
  modalBody: {
    maxHeight: '90%',
  },
  modalText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  validInput: {
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  invalidInput: {
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  disabledButton: {
    backgroundColor: '#cccccc',
    opacity: 0.7,
  },
  picker: {
    flex: 1,
    color: '#000',
    marginLeft: -10,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 55,
  },
  dateButtonText: {
    flex: 1,
    color: '#000',
    fontSize: 14,
  },
});

export default SignUpScreen;
