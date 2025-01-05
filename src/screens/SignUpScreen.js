import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, StatusBar, Platform, Modal, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import BackButton from '../components/BackButton';
import { isValidEmail } from '../utils/validation';
import { FONTS } from '../theme/fonts';
import BackgroundLogo from '../components/BackgroundLogo';

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [showPassword, setShowPassword] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tcKimlik: '',
    email: '',
    phone: '',
    password: '',
    agreeToTerms: false
  });

  const formatPhoneNumber = (text) => {
    const numbers = text.replace(/[^\d]/g, '');

    if (numbers.length <= 3) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)} - ${numbers.slice(6)}`;
    }
    return numbers;
  };

  const handleInputChange = (field, value) => {
    if (field === 'tcKimlik') {
      const numericValue = value.replace(/[^0-9]/g, '');
      if (numericValue.length <= 11) {
        setFormData(prev => ({ ...prev, [field]: numericValue }));
      }
    } else if (field === 'phone') {
      const numericValue = value.replace(/[^\d]/g, '');
      if (numericValue.length <= 10) { 
        const formattedNumber = formatPhoneNumber(numericValue);
        setFormData(prev => ({ ...prev, [field]: formattedNumber }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const getEmailValidationStyle = () => {
    if (formData.email.length === 0) return styles.inputWrapper;
    return isValidEmail(formData.email) 
      ? [styles.inputWrapper, styles.validInput]
      : [styles.inputWrapper, styles.invalidInput];
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Kayıt Ol</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.mainContent}>
      <BackgroundLogo />
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <MaterialIcons name="person" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Ad Soyad"
              placeholderTextColor="#666"
              value={formData.name}
              onChangeText={(text) => handleInputChange('name', text)}
            />
          </View>

          <View style={styles.inputWrapper}>
            <MaterialIcons name="credit-card" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="TC Kimlik Numarası"
              placeholderTextColor="#666"
              keyboardType="numeric"
              maxLength={11}
              value={formData.tcKimlik}
              onChangeText={(text) => handleInputChange('tcKimlik', text)}
            />
            {formData.tcKimlik.length > 0 && (
              formData.tcKimlik.length === 11 ? (
                <MaterialIcons name="check-circle" size={20} color="#4CAF50" />
              ) : (
                <Text style={styles.characterCount}>{formData.tcKimlik.length}/11</Text>
              )
            )}
          </View>

          <View style={getEmailValidationStyle()}>
            <MaterialIcons 
              name="email" 
              size={20} 
              color={formData.email.length > 0 ? (isValidEmail(formData.email) ? '#4CAF50' : '#FF5252') : '#666'} 
              style={styles.inputIcon} 
            />
            <TextInput
              style={styles.input}
              placeholder="E-posta Adresi"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
            />
            {formData.email.length > 0 && (
              <MaterialIcons 
                name={isValidEmail(formData.email) ? "check-circle" : "error"} 
                size={20} 
                color={isValidEmail(formData.email) ? '#4CAF50' : '#FF5252'} 
              />
            )}
          </View>

          <View style={styles.inputWrapper}>
            <MaterialIcons name="phone" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Telefon Numarası"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
            />
          </View>

          <View style={styles.inputWrapper}>
            <MaterialIcons name="lock" size={20} color="#666" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Şifre"
              secureTextEntry={!showPassword}
              placeholderTextColor="#666"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
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

          <View style={styles.termsContainer}>
            <TouchableOpacity 
              style={styles.checkbox}
              onPress={() => handleInputChange('agreeToTerms', !formData.agreeToTerms)}
            >
              {formData.agreeToTerms && (
                <MaterialIcons name="check" size={16} color="#008B8B" />
              )}
            </TouchableOpacity>
            <View style={styles.termsTextContainer}>
              <Text style={styles.termsText}>
                Kullanım koşullarını{' '}
                <Text style={styles.termsLink} onPress={() => setShowTerms(true)}>
                  kabul ediyorum
                </Text>
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          style={[
            styles.signUpButton,
            !formData.agreeToTerms && styles.signUpButtonDisabled
          ]}
          disabled={!formData.agreeToTerms}
        >
          <Text style={styles.signUpButtonText}>Kayıt Ol</Text>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Zaten hesabınız var mı? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}>Giriş Yap</Text>
          </TouchableOpacity>
        </View>
      </View>

        {/* Modal kısmı burası - Kullanım koşullarını kabul ediyorum kısmı */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showTerms}
        onRequestClose={() => setShowTerms(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Kullanım Koşulları</Text>
              <TouchableOpacity onPress={() => setShowTerms(false)}>
                <MaterialIcons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              <Text style={styles.modalText}>
                1. Gizlilik ve Güvenlik{'\n\n'}
                Kişisel verileriniz güvenli bir şekilde saklanacak ve üçüncü taraflarla paylaşılmayacaktır.{'\n\n'}
                2. Hizmet Kullanımı{'\n\n'}
                Sistemimiz üzerinden randevu alırken doğru ve güncel bilgiler kullanmanız gerekmektedir.{'\n\n'}
                3. Sorumluluklar{'\n\n'}
                Randevunuza gelemeyecekseniz en az 24 saat öncesinden iptal etmeniz gerekmektedir.{'\n\n'}
                4. İletişim{'\n\n'}
                Sistemle ilgili tüm sorunlarınızı destek ekibimize bildirebilirsiniz.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* Modal kısmı burası - Kullanım koşullarını kabul ediyorum kısmı */}
      
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
    paddingTop: 20,
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
});

export default SignUpScreen; 