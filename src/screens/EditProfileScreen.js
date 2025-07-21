import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView,
    ScrollView, ActivityIndicator, Platform, StatusBar, KeyboardAvoidingView
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import DateTimePicker from '@react-native-community/datetimepicker';

import { updateMyProfile } from '../services/userService';
import { FONTS } from '../theme/fonts';
import BackButton from '../components/BackButton';

const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (`0${d.getMonth() + 1}`).slice(-2);
    const day = (`0${d.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
};

const IconTextInput = ({ icon, ...props }) => (
    <View style={styles.inputContainer}>
        <MaterialIcons name={icon} size={22} color="#888" style={styles.inputIcon} />
        <TextInput style={styles.input} placeholderTextColor="#999" {...props} />
    </View>
);

const BooleanSelector = ({ label, value, onValueChange }) => (
    <View style={styles.booleanContainer}>
        <Text style={styles.booleanLabel}>{label}</Text>
        <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
                style={[styles.booleanButton, value === true && styles.booleanButtonActive]}
                onPress={() => onValueChange(true)}
            >
                <MaterialIcons name="check" size={20} color={value === true ? '#fff' : '#4CAF50'} />
                <Text style={[styles.booleanButtonText, value === true && styles.booleanButtonTextActive]}>Evet</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.booleanButton, value === false && styles.booleanButtonActive]}
                onPress={() => onValueChange(false)}
            >
                <MaterialIcons name="close" size={20} color={value === false ? '#fff' : '#FF5252'} />
                <Text style={[styles.booleanButtonText, value === false && styles.booleanButtonTextActive]}>Hayır</Text>
            </TouchableOpacity>
        </View>
    </View>
);

const EditProfileScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { userData } = route.params;

    const [formData, setFormData] = useState({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phoneNumber: userData.phoneNumber || '',
        dateOfBirth: userData.patientProfile?.dateOfBirth ? new Date(userData.patientProfile.dateOfBirth) : new Date(),
        weight: userData.patientProfile?.weight?.toString() || '',
        height: userData.patientProfile?.height?.toString() || '',
        address: userData.patientProfile?.address || '',
        // DÜZELTME: || false kaldırıldı. Artık null ise null olarak başlayacak.
        hasChronicIllness: userData.patientProfile?.hasChronicIllness,
        isMedicationDependent: userData.patientProfile?.isMedicationDependent,
        birthPlaceCity: userData.patientProfile?.birthPlaceCity || '',
        birthPlaceDistrict: userData.patientProfile?.birthPlaceDistrict || '',
        country: userData.patientProfile?.country || '',
    });

    const [loading, setLoading] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(Platform.OS === 'ios');
        if (selectedDate) {
            setFormData(prev => ({ ...prev, dateOfBirth: selectedDate }));
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const payload = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                dateOfBirth: formatDate(formData.dateOfBirth),
                weight: formData.weight ? parseFloat(formData.weight) : null,
                height: formData.height ? parseFloat(formData.height) : null,
                address: formData.address,
                hasChronicIllness: formData.hasChronicIllness,
                isMedicationDependent: formData.isMedicationDependent,
                birthPlaceCity: formData.birthPlaceCity,
                birthPlaceDistrict: formData.birthPlaceDistrict,
                country: formData.country,
            };

            await updateMyProfile(payload);
            Toast.show({ type: 'success', text1: 'Başarılı', text2: 'Profiliniz güncellendi.' });
            navigation.goBack();
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Hata', text2: error.message || 'Profil güncellenemedi.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.header}>
                    <BackButton />
                    <Text style={styles.headerTitle}>Profili Düzenle</Text>
                    <View style={{ width: 34 }} />
                </View>
                <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Kişisel Bilgiler</Text>
                        <IconTextInput icon="person" placeholder="Ad" value={formData.firstName} onChangeText={text => handleInputChange('firstName', text)} />
                        <IconTextInput icon="person-outline" placeholder="Soyad" value={formData.lastName} onChangeText={text => handleInputChange('lastName', text)} />
                        <IconTextInput icon="email" placeholder="E-posta Adresi" value={formData.email} onChangeText={text => handleInputChange('email', text)} keyboardType="email-address" autoCapitalize="none" />
                        <IconTextInput icon="phone" placeholder="Telefon Numarası" value={formData.phoneNumber} onChangeText={text => handleInputChange('phoneNumber', text)} keyboardType="phone-pad" maxLength={13} />
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Hasta Profili</Text>
                        <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
                            <MaterialIcons name="cake" size={22} color="#888" style={styles.inputIcon} />
                            <Text style={styles.dateText}>Doğum Tarihi: {formatDate(formData.dateOfBirth)}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker value={formData.dateOfBirth} mode="date" display="default" onChange={handleDateChange} maximumDate={new Date()} />
                        )}
                        <IconTextInput icon="height" placeholder="Boy (cm)" value={formData.height} onChangeText={text => handleInputChange('height', text.replace(/[^0-9.]/g, ''))} keyboardType="numeric" />
                        <IconTextInput icon="monitor-weight" placeholder="Kilo (kg)" value={formData.weight} onChangeText={text => handleInputChange('weight', text.replace(/[^0-9.]/g, ''))} keyboardType="numeric" />
                        <IconTextInput icon="public" placeholder="Ülke" value={formData.country} onChangeText={text => handleInputChange('country', text)} />
                        <IconTextInput icon="location-city" placeholder="Doğum Yeri (Şehir)" value={formData.birthPlaceCity} onChangeText={text => handleInputChange('birthPlaceCity', text)} />
                        <IconTextInput icon="business" placeholder="Doğum Yeri (İlçe)" value={formData.birthPlaceDistrict} onChangeText={text => handleInputChange('birthPlaceDistrict', text)} />

                        <View style={[styles.inputContainer, { height: 120, alignItems: 'flex-start' }]}>
                            <MaterialIcons name="location-pin" size={22} color="#888" style={[styles.inputIcon, { paddingTop: 15 }]} />
                            <TextInput
                                style={[styles.input, { textAlignVertical: 'top', paddingTop: 15 }]}
                                placeholder="Adres"
                                placeholderTextColor="#999"
                                value={formData.address}
                                onChangeText={text => handleInputChange('address', text)}
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <BooleanSelector label="Kronik Hastalık Var mı?" value={formData.hasChronicIllness} onValueChange={value => handleInputChange('hasChronicIllness', value)} />
                        <BooleanSelector label="Sürekli İlaç Kullanımı Var mı?" value={formData.isMedicationDependent} onValueChange={value => handleInputChange('isMedicationDependent', value)} />
                    </View>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                        {loading ? <ActivityIndicator color="#fff" /> : <><MaterialIcons name="save" size={20} color="#fff" /><Text style={styles.saveButtonText}>Kaydet</Text></>}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8F8F8' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0', backgroundColor: '#fff' },
    headerTitle: { fontSize: 20, fontFamily: FONTS.inter.semiBold },
    scrollContainer: { padding: 10, paddingBottom: 40 },
    card: { backgroundColor: '#fff', borderRadius: 12, padding: 20, marginBottom: 15, shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
    sectionTitle: { fontSize: 18, fontFamily: FONTS.inter.bold, color: '#333', marginBottom: 20 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F5F5F5', borderRadius: 12, marginBottom: 15, minHeight: 55 },
    inputIcon: { marginHorizontal: 15 },
    input: { flex: 1, paddingRight: 15, fontSize: 16, color: '#333' },
    dateText: { fontSize: 16, color: '#333' },
    saveButton: { flexDirection: 'row', backgroundColor: '#008B8B', padding: 16, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginTop: 10 },
    saveButtonText: { color: '#fff', fontSize: 16, fontFamily: FONTS.inter.semiBold, marginLeft: 10 },
    booleanContainer: { marginBottom: 15, marginTop: 10 },
    booleanLabel: { fontSize: 16, color: '#333', fontFamily: FONTS.inter.medium, marginBottom: 10 },
    booleanButton: { flexDirection: 'row', flex: 1, padding: 15, borderRadius: 12, backgroundColor: '#F5F5F5', alignItems: 'center', justifyContent: 'center', marginHorizontal: 5 },
    booleanButtonActive: { backgroundColor: '#008B8B' },
    booleanButtonText: { fontSize: 16, color: '#333', fontFamily: FONTS.inter.regular, marginLeft: 8 },
    booleanButtonTextActive: { color: '#fff', fontFamily: FONTS.inter.semiBold },
});

export default EditProfileScreen;
