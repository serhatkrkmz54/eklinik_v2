import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import BackButton from '../components/BackButton';
import { isValidEmail } from '../utils/validation';
import { FONTS } from '../theme/fonts';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation();
  const [method, setMethod] = useState('email');
  const [value, setValue] = useState('');

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

  const handleInputChange = (text) => {
    if (method === 'phone') {
      const numericValue = text.replace(/[^\d]/g, '');
      if (numericValue.length <= 10) {
        setValue(formatPhoneNumber(numericValue));
      }
    } else {
      setValue(text);
    }
  };

  const getInputValidation = () => {
    if (value.length === 0) return styles.inputWrapper;
    if (method === 'email') {
      return isValidEmail(value) 
        ? [styles.inputWrapper, styles.validInput]
        : [styles.inputWrapper, styles.invalidInput];
    }

    return value.replace(/[^\d]/g, '').length === 10
      ? [styles.inputWrapper, styles.validInput]
      : [styles.inputWrapper, styles.invalidInput];
  };

  const isValidInput = () => {
    if (method === 'email') return isValidEmail(value);
    return value.replace(/[^\d]/g, '').length === 10;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Şifremi Unuttum</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.mainContent}>
        <Text style={styles.description}>
          Şifre değiştirmek için bilgilerinizi doğru giriniz. Size doğrulama kodu göndereceğiz.
        </Text>

        <View style={styles.secenekSecimi}>
          <TouchableOpacity 
            style={[
              styles.methodButton,
              method === 'email' && styles.methodButtonActive
            ]}
            onPress={() => {
              setMethod('email');
              setValue('');
            }}
          >
            <Text style={[
              styles.methodButtonText,
              method === 'email' && styles.methodButtonTextActive
            ]}>Email</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.methodButton,
              method === 'phone' && styles.methodButtonActive
            ]}
            onPress={() => {
              setMethod('phone');
              setValue('');
            }}
          >
            <Text style={[
              styles.methodButtonText,
              method === 'phone' && styles.methodButtonTextActive
            ]}>Telefon</Text>
          </TouchableOpacity>
        </View>

        <View style={getInputValidation()}>
          <MaterialIcons 
            name={method === 'email' ? 'email' : 'phone'} 
            size={20} 
            color={value.length > 0 ? (isValidInput() ? '#50A9F9' : '#FF5252') : '#666'} 
            style={styles.inputIcon} 
          />
          <TextInput
            style={styles.input}
            placeholder={method === 'email' ? 'E-posta adresiniz' : 'Telefon numaranız'}
            placeholderTextColor="#666"
            keyboardType={method === 'email' ? 'email-address' : 'numeric'}
            autoCapitalize="none"
            value={value}
            onChangeText={handleInputChange}
          />
          {value.length > 0 && (
            <MaterialIcons 
              name={isValidInput() ? "check-circle" : "error"} 
              size={20} 
              color={isValidInput() ? '#4CAF50' : '#FF5252'} 
            />
          )}
        </View>

        <TouchableOpacity 
          style={[
            styles.resetButton,
            !isValidInput() && styles.resetButtonDisabled
          ]}
          disabled={!isValidInput()}
        >
          <Text style={styles.resetButtonText}>Şifremi Sıfırla</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 30,
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
  description: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  secenekSecimi: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  methodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
  },
  methodButtonActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  methodButtonText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  methodButtonTextActive: {
    color: '#50A9F9',
    fontWeight: '600',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    marginBottom: 20,
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
  validInput: {
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  invalidInput: {
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  resetButton: {
    backgroundColor: '#50A9F9',
    padding: 16,
    borderRadius: 12,
    height: 55,
    justifyContent: 'center',
  },
  resetButtonDisabled: {
    backgroundColor: '#ccc',
  },
  resetButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: FONTS.poppins.semiBold,
  },
});

export default ForgotPasswordScreen; 