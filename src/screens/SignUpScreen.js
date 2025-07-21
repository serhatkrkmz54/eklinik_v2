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
import BackgroundLogo from '../components/BackgroundLogo';
import DateTimePicker from '@react-native-community/datetimepicker';
import Toast from 'react-native-toast-message';

// Gerekli servis ve context importları
import { registerUser } from '../services/authService';
import { AuthContext } from '../context/AuthContext';

// Tarihi YYYY-MM-DD formatına çeviren yardımcı fonksiyon
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
        <StatusBar barStyle='dark-content' backgroundColor='#fff' />
        <Modal
            transparent={true}
            visible={showSuccessModal}
            animationType="fade"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color="#008B8B" />
              <Text style={styles.modalText}>Kayıt başarıyla tamamlandı!</Text>
              <Text style={styles.modalSubText}>Sisteme giriş yapılıyor...</Text>
            </View>
          </View>
        </Modal>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <View style={styles.header}>
            <BackButton />
            <Text style={styles.headerTitle}>Kayıt Ol</Text>
            <View style={{width: 34}}/>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 50, marginTop: 20 }} keyboardShouldPersistTaps='handled'>
            <BackgroundLogo style={{ height: 100, marginBottom: 20 }} />

            {/* GÜNCELLENDİ: Ad ve Soyad için iki ayrı input alanı */}
            <View style={styles.inputWrapper}><MaterialIcons name='person' size={20} color='#666' style={styles.inputIcon} /><TextInput style={styles.input} placeholder='Ad' value={formData.firstName} onChangeText={(text) => handleInputChange('firstName', text)}/></View>
            <View style={styles.inputWrapper}><MaterialIcons name='person' size={20} color='#666' style={styles.inputIcon} /><TextInput style={styles.input} placeholder='Soyad' value={formData.lastName} onChangeText={(text) => handleInputChange('lastName', text)}/></View>

            <View style={styles.inputWrapper}><MaterialIcons name='credit-card' size={20} color='#666' style={styles.inputIcon} /><TextInput style={styles.input} placeholder='TC Kimlik Numarası' keyboardType='numeric' maxLength={11} value={formData.tcKimlik} onChangeText={(text) => handleInputChange('tcKimlik', text.replace(/[^0-9]/g, ''))}/></View>
            <View style={styles.inputWrapper}><MaterialIcons name='email' size={20} color='#666' style={styles.inputIcon} /><TextInput style={styles.input} placeholder='E-posta Adresi' keyboardType='email-address' autoCapitalize='none' value={formData.email} onChangeText={(text) => handleInputChange('email', text)}/></View>
            <View style={styles.inputWrapper}><MaterialIcons name='phone' size={20} color='#666' style={styles.inputIcon} /><TextInput style={styles.input} placeholder='Telefon (+905...)' keyboardType='phone-pad' maxLength={13} value={formData.phone} onChangeText={(text) => handleInputChange('phone', text)}/></View>
            <View style={styles.inputWrapper}><MaterialIcons name='lock' size={20} color='#666' style={styles.inputIcon} /><TextInput style={styles.input} placeholder='Şifre (en az 6 karakter)' secureTextEntry={!showPassword} value={formData.password} onChangeText={(text) => handleInputChange('password', text)}/><TouchableOpacity onPress={() => setShowPassword(v => !v)}><Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color='#666' /></TouchableOpacity></View>
            <View style={styles.inputWrapper}><MaterialIcons name='lock' size={20} color='#666' style={styles.inputIcon} /><TextInput style={styles.input} placeholder='Şifre Onay' secureTextEntry={!showPassword} value={formData.password_confirmation} onChangeText={(text) => handleInputChange('password_confirmation', text)}/></View>

            <TouchableOpacity style={styles.dateButton} onPress={() => setShowDatePicker(true)}><MaterialIcons name='calendar-today' size={20} color='#666' style={styles.inputIcon} /><Text style={styles.dateButtonText}>Doğum Tarihi: {formatDate(formData.birth_date)}</Text></TouchableOpacity>
            {showDatePicker && (<DateTimePicker value={formData.birth_date} mode='date' display='default' onChange={handleDateChange} maximumDate={new Date()} />)}

            <View style={styles.termsContainer}><TouchableOpacity style={styles.checkbox} onPress={() => handleInputChange('agreeToTerms', !formData.agreeToTerms)}>{formData.agreeToTerms && (<MaterialIcons name='check' size={16} color='#008B8B' />)}</TouchableOpacity><Text style={styles.termsText}>Kullanım koşullarını <Text style={styles.termsLink} onPress={() => setShowTerms(true)}>kabul ediyorum</Text></Text></View>
            <TouchableOpacity style={[styles.signUpButton, (!isFormValid() || loading) && styles.signUpButtonDisabled]} disabled={!isFormValid() || loading} onPress={handleSignUp}><Text style={styles.signUpButtonText}>{loading ? 'Kaydediliyor...' : 'Kayıt Ol'}</Text></TouchableOpacity>
            <View style={styles.loginContainer}><Text style={styles.loginText}>Zaten hesabınız var mı? </Text><TouchableOpacity onPress={() => navigation.navigate('Login')}><Text style={styles.loginLink}>Giriş Yap</Text></TouchableOpacity></View>
          </ScrollView>
        </KeyboardAvoidingView>

        <Modal animationType='slide' transparent={true} visible={showTerms} onRequestClose={() => setShowTerms(false)}>
          <View style={styles.modalContainer}><View style={styles.modalContent}><View style={styles.modalHeader}><Text style={styles.modalTitle}>Kullanım Koşulları</Text><TouchableOpacity onPress={() => setShowTerms(false)}><MaterialIcons name='close' size={24} color='#000' /></TouchableOpacity></View><ScrollView style={styles.modalBody}><Text style={styles.modalText}>1. Gizlilik ve Güvenlik{'\n\n'}Kişisel verileriniz güvenli bir şekilde saklanacak ve üçüncü taraflarla paylaşılmayacaktır.{'\n\n'}2. Hizmet Kullanımı{'\n\n'}Sistemimiz üzerinden randevu alırken doğru ve güncel bilgiler kullanmanız gerekmektedir.{'\n\n'}3. Sorumluluklar{'\n\n'}Randevunuza gelemeyecekseniz en az 24 saat öncesinden iptal etmeniz gerekmektedir.</Text></ScrollView></View></View>
        </Modal>
        <Toast />
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20, marginBottom: 10 },
  headerTitle: { fontFamily: FONTS.inter.semiBold, fontSize: 20, color: '#000' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, marginBottom: 15, paddingHorizontal: 15, height: 55 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: '#000', fontSize: 14 },
  dateButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, marginBottom: 15, paddingHorizontal: 15, height: 55 },
  dateButtonText: { color: '#000', fontSize: 14 },
  termsContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, marginBottom: 20 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: '#008B8B', marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  termsText: { fontSize: 14, color: '#666' },
  termsLink: { color: '#008B8B', textDecorationLine: 'underline' },
  signUpButton: { backgroundColor: '#008B8B', padding: 16, borderRadius: 12, marginBottom: 20, height: 55, justifyContent: 'center', alignItems: 'center' },
  signUpButtonDisabled: { backgroundColor: '#A9A9A9' },
  signUpButtonText: { color: '#fff', textAlign: 'center', fontSize: 16, fontFamily: FONTS.poppins.semiBold },
  loginContainer: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: '#666', fontSize: 16 },
  loginLink: { color: '#008B8B', fontWeight: '600', fontSize: 16 },
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

export default SignUpScreen;
