import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView,
  StatusBar, Platform, Modal, ScrollView, KeyboardAvoidingView, ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import BackButton from '../components/BackButton';
import { isValidEmail } from '../utils/validation';
import { FONTS } from '../theme/fonts';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';
import { LinearGradient } from 'expo-linear-gradient';

import { registerUser } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

// --- FONKSİYONEL YAPI DEĞİŞMEDİ ---
const formatDate = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

const SignUpScreen = () => {
  const navigation = useNavigation();
  const { login } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null); // Odaklanma stili için
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    tcKimlik: '',
    email: '',
    phone: '+90',
    password: '',
    password_confirmation: '',
    agreeToTerms: false,
    birth_date: new Date(),
  });

  const handleInputChange = (field, value) => {
    if (field === 'phone') {
      const cleaned = value.replace(/[^+0-9]/g, '');
      if (cleaned.startsWith('+90') || cleaned === '+' || cleaned === '+9') {
        setFormData(prev => ({ ...prev, [field]: cleaned }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const isFormValid = () => (
      isValidEmail(formData.email) &&
      formData.password.trim().length >= 6 &&
      formData.password === formData.password_confirmation &&
      formData.firstName.trim().length >= 3 &&
      formData.lastName.trim().length >= 3 &&
      formData.tcKimlik.trim().length === 11 &&
      /^\+90\d{10}$/.test(formData.phone) &&
      formData.agreeToTerms
  );

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setFormData(prev => ({ ...prev, birth_date: selectedDate }));
    }
  };

  const handleSignUp = async () => {
    if (!isFormValid()) {
      Toast.show({ type: 'error', text1: 'Eksik Bilgi', text2: 'Lütfen tüm alanları doğru bir şekilde doldurun.' });
      return;
    }
    setLoading(true);
    let isSignUpSuccessful = false;
    try {
      const response = await registerUser(formData);

      if (response?.accessToken) {
        isSignUpSuccessful = true;
        setShowSuccessModal(true);
        setTimeout(() => {
          login(response.accessToken);
        }, 2000);
      } else {
        throw new Error('Kayıt sonrası token alınamadı.');
      }
    } catch (err) {
      console.error('Kayıt hatası:', err);
      let errorMessage = 'Kayıt işlemi sırasında bir hata oluştu.';
      if (err?.message) errorMessage = err.message;
      if (err?.errors) errorMessage = Object.values(err.errors).join('\n');

      Toast.show({
        type: 'error',
        text1: 'Kayıt Hatası',
        text2: errorMessage,
      });
    } finally {
      if (!isSignUpSuccessful) {
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
              <Text style={styles.modalText}>Kayıt Başarılı!</Text>
              <Text style={styles.modalSubText}>Sisteme giriş yapılıyor...</Text>
            </View>
          </View>
        </Modal>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1, marginTop: 30 }}>
          <View style={styles.header}>
            <BackButton />
            <Text style={styles.headerTitle}>Yeni Hesap Oluştur</Text>
            <View style={{width: 34}}/>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps='handled'>
            <View style={styles.nameContainer}>
              <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }, focusedInput === 'firstName' && styles.inputWrapperFocused]}>
                <MaterialIcons name='person-outline' size={22} color={focusedInput === 'firstName' ? '#008B8B' : '#A0AEC0'} style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder='Adınız' value={formData.firstName} onChangeText={(text) => handleInputChange('firstName', text)} onFocus={() => setFocusedInput('firstName')} onBlur={() => setFocusedInput(null)}/>
              </View>
              <View style={[styles.inputWrapper, { flex: 1 }, focusedInput === 'lastName' && styles.inputWrapperFocused]}>
                <MaterialIcons name='person-outline' size={22} color={focusedInput === 'lastName' ? '#008B8B' : '#A0AEC0'} style={styles.inputIcon} />
                <TextInput style={styles.input} placeholder='Soyadınız' value={formData.lastName} onChangeText={(text) => handleInputChange('lastName', text)} onFocus={() => setFocusedInput('lastName')} onBlur={() => setFocusedInput(null)}/>
              </View>
            </View>

            <View style={[styles.inputWrapper, focusedInput === 'tcKimlik' && styles.inputWrapperFocused]}><MaterialIcons name='badge' size={22} color={focusedInput === 'tcKimlik' ? '#008B8B' : '#A0AEC0'} style={styles.inputIcon} /><TextInput style={styles.input} placeholder='T.C. Kimlik Numarası' keyboardType='numeric' maxLength={11} value={formData.tcKimlik} onChangeText={(text) => handleInputChange('tcKimlik', text.replace(/[^0-9]/g, ''))} onFocus={() => setFocusedInput('tcKimlik')} onBlur={() => setFocusedInput(null)}/></View>
            <View style={[styles.inputWrapper, focusedInput === 'email' && styles.inputWrapperFocused]}><MaterialIcons name='alternate-email' size={22} color={focusedInput === 'email' ? '#008B8B' : '#A0AEC0'} style={styles.inputIcon} /><TextInput style={styles.input} placeholder='E-posta Adresi' keyboardType='email-address' autoCapitalize='none' value={formData.email} onChangeText={(text) => handleInputChange('email', text)} onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput(null)}/></View>
            <View style={[styles.inputWrapper, focusedInput === 'phone' && styles.inputWrapperFocused]}><MaterialIcons name='phone-iphone' size={22} color={focusedInput === 'phone' ? '#008B8B' : '#A0AEC0'} style={styles.inputIcon} /><TextInput style={styles.input} placeholder='Telefon (+905...)' keyboardType='phone-pad' maxLength={13} value={formData.phone} onChangeText={(text) => handleInputChange('phone', text)} onFocus={() => setFocusedInput('phone')} onBlur={() => setFocusedInput(null)}/></View>

            <TouchableOpacity style={styles.inputWrapper} onPress={() => setShowDatePicker(true)}>
              <MaterialIcons name='calendar-today' size={22} color='#A0AEC0' style={styles.inputIcon} />
              <Text style={styles.dateButtonText}>{formatDate(formData.birth_date)}</Text>
            </TouchableOpacity>
            {showDatePicker && (<DateTimePicker value={formData.birth_date} mode='date' display='spinner' onChange={handleDateChange} maximumDate={new Date()} />)}

            <View style={[styles.inputWrapper, focusedInput === 'password' && styles.inputWrapperFocused]}><MaterialIcons name='lock-outline' size={22} color={focusedInput === 'password' ? '#008B8B' : '#A0AEC0'} style={styles.inputIcon} /><TextInput style={styles.input} placeholder='Şifre (en az 6 karakter)' secureTextEntry={!showPassword} value={formData.password} onChangeText={(text) => handleInputChange('password', text)} onFocus={() => setFocusedInput('password')} onBlur={() => setFocusedInput(null)}/><TouchableOpacity onPress={() => setShowPassword(v => !v)}><Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color='#A0AEC0' /></TouchableOpacity></View>
            <View style={[styles.inputWrapper, focusedInput === 'password_confirmation' && styles.inputWrapperFocused]}><MaterialIcons name='lock-outline' size={22} color={focusedInput === 'password_confirmation' ? '#008B8B' : '#A0AEC0'} style={styles.inputIcon} /><TextInput style={styles.input} placeholder='Şifre Tekrarı' secureTextEntry={!showPassword} value={formData.password_confirmation} onChangeText={(text) => handleInputChange('password_confirmation', text)} onFocus={() => setFocusedInput('password_confirmation')} onBlur={() => setFocusedInput(null)}/></View>

            <View style={styles.termsContainer}>
              <TouchableOpacity style={[styles.checkbox, formData.agreeToTerms && styles.checkboxChecked]} onPress={() => handleInputChange('agreeToTerms', !formData.agreeToTerms)}>
                {formData.agreeToTerms && (<MaterialIcons name='check' size={18} color='#FFFFFF' />)}
              </TouchableOpacity>
              <Text style={styles.termsText}>
                <Text style={styles.termsLink} onPress={() => setShowTerms(true)}>Kullanım koşullarını</Text> okudum ve kabul ediyorum.
              </Text>
            </View>

            <TouchableOpacity
                onPress={handleSignUp}
                disabled={!isFormValid() || loading}
                activeOpacity={0.8}
                style={[styles.signUpButton, (!isFormValid() || loading) && styles.signUpButtonDisabled]}
            >
              {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                  <Text style={styles.signUpButtonText}>Hesap Oluştur</Text>
              )}
            </TouchableOpacity>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Zaten bir hesabınız var mı? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.loginLink}>Giriş Yapın</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        <Modal animationType='slide' transparent={true} visible={showTerms} onRequestClose={() => setShowTerms(false)}>
          <View style={styles.modalView}>
            <View style={styles.modalContentWrapper}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Kullanım Koşulları</Text>
                <TouchableOpacity onPress={() => setShowTerms(false)} style={styles.closeButton}>
                  <MaterialIcons name='close' size={24} color='#1A202C' />
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.modalBody}>
                <Text style={styles.termsModalText}>
                  1. Gizlilik ve Güvenlik{'\n\n'}Kişisel verileriniz, Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca güvenli bir şekilde saklanacak ve yasal zorunluluklar dışında üçüncü taraflarla paylaşılmayacaktır.{'\n\n'}
                  2. Hizmet Kullanımı{'\n\n'}Sistemimiz üzerinden randevu alırken doğru ve güncel bilgiler kullanmanız gerekmektedir. Yanlış veya eksik bilgi verilmesi durumunda hizmet kalitesi etkilenebilir.{'\n\n'}
                  3. Sorumluluklar{'\n\n'}Randevunuza gelemeyecekseniz, diğer hastalara yer açmak adına en az 24 saat öncesinden uygulama üzerinden iptal etmeniz önemle rica olunur.
                </Text>
              </ScrollView>
            </View>
          </View>
        </Modal>
        <Toast />
      </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  backgroundGradient: { position: 'absolute', left: 0, right: 0, top: 0, height: '100%' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 10 : 0,
    paddingBottom: 10,
  },
  headerTitle: { fontFamily: FONTS.inter.semiBold, fontSize: 20, color: '#1A202C' },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 50, marginTop: 20 },
  nameContainer: {
    flexDirection: 'row',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#2D3748',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  inputWrapperFocused: {
    borderColor: '#008B8B',
    shadowColor: '#008B8B',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: '#1A202C', fontSize: 16, fontFamily: FONTS.inter.regular },
  dateButtonText: { color: '#1A202C', fontSize: 16, fontFamily: FONTS.inter.regular },
  termsContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 24, paddingHorizontal: 5 },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CBD5E0',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#008B8B',
    borderColor: '#008B8B',
  },
  termsText: { fontSize: 14, color: '#4A5568', flex: 1, fontFamily: FONTS.inter.regular },
  termsLink: { color: '#008B8B', fontFamily: FONTS.inter.semiBold, textDecorationLine: 'underline' },
  signUpButton: {
    backgroundColor: '#008B8B',
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
  signUpButtonDisabled: {
    backgroundColor: '#A0AEC0',
    shadowOpacity: 0,
    elevation: 0,
  },
  signUpButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: FONTS.inter.semiBold },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  loginText: { color: '#718096', fontSize: 14, fontFamily: FONTS.inter.regular },
  loginLink: { color: '#008B8B', fontFamily: FONTS.inter.semiBold, fontSize: 14, marginLeft: 4 },
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
  modalView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContentWrapper: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    height: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTS.inter.bold,
    color: '#1A202C',
  },
  closeButton: {
    padding: 5,
  },
  modalBody: {
    marginTop: 15,
  },
  termsModalText: {
    fontSize: 16,
    fontFamily: FONTS.inter.regular,
    color: '#4A5568',
    lineHeight: 24,
  },
});

export default SignUpScreen;
