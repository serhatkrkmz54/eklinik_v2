import React, {useCallback, useState} from 'react';
import {ActivityIndicator, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {useFocusEffect, useRoute} from '@react-navigation/native';
import {MaterialIcons} from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import BackButton from '../components/BackButton';
import {getMyAppointmentDetails} from '../services/appointmentService';

// Helper Functions
const formatAppointmentDate = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
};
const formatAppointmentTime = (dateTimeString) => {
    if (!dateTimeString) return '';
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
};

// Info Row Component
const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
        <MaterialIcons name={icon} size={24} color="#008B8B" />
        <View style={styles.infoTextContainer}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value || 'Belirtilmemiş'}</Text>
        </View>
    </View>
);

const AppointmentDetailScreen = () => {
    const route = useRoute();
    const { appointmentId } = route.params;
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchDetails = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getMyAppointmentDetails(appointmentId);
            setDetails(data);
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Hata', text2: error.message });
        } finally {
            setLoading(false);
        }
    }, [appointmentId]);

    useFocusEffect(
        useCallback(() => {
            fetchDetails();
        }, [fetchDetails])
    );

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <BackButton />
                    <Text style={styles.headerTitle}>Randevu Detayı</Text>
                    <View style={{ width: 24 }} />
                </View>
                <ActivityIndicator style={{ flex: 1 }} size="large" color="#008B8B" />
            </SafeAreaView>
        );
    }

    if (!details) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <BackButton />
                    <Text style={styles.headerTitle}>Randevu Detayı</Text>
                    <View style={{ width: 24 }} />
                </View>
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Randevu detayı bulunamadı.</Text>
                </View>
            </SafeAreaView>
        );
    }

    const { medicalRecord } = details;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            <View style={styles.header}>
                <BackButton />
                <Text style={styles.headerTitle}>Randevu Detayı</Text>
                <View style={{ width: 24 }} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.card}>
                    <InfoRow icon="person" label="Doktor" value={details.doctorFullName} />
                    <InfoRow icon="local-hospital" label="Klinik" value={details.clinicName} />
                    <InfoRow icon="event" label="Tarih" value={formatAppointmentDate(details.appointmentTime)} />
                    <InfoRow icon="access-time" label="Saat" value={formatAppointmentTime(details.appointmentTime)} />
                </View>

                {medicalRecord ? (
                    <>
                        <Text style={styles.sectionTitle}>Tıbbi Kayıt</Text>
                        <View style={styles.card}>
                            <InfoRow icon="description" label="Tanı / Teşhis" value={medicalRecord.diagnosis} />
                            {medicalRecord.notes && (
                                <InfoRow icon="edit-note" label="Doktor Notları" value={medicalRecord.notes} />
                            )}
                        </View>

                        {medicalRecord.prescriptions && medicalRecord.prescriptions.length > 0 && (
                            <>
                                <Text style={styles.sectionTitle}>Reçete Edilen İlaçlar</Text>
                                <View style={styles.card}>
                                    {medicalRecord.prescriptions.map((rx, index) => (
                                        <View key={index} style={[styles.prescriptionItem, index === medicalRecord.prescriptions.length - 1 && { borderBottomWidth: 0 }]}>
                                            <MaterialIcons name="medication" size={24} color="#008B8B" />
                                            <View style={styles.infoTextContainer}>
                                                <Text style={styles.infoValue}>{rx.medicationName}</Text>
                                                <Text style={styles.infoLabel}>
                                                    Dozaj: {rx.dosage} - Süre: {rx.duration}
                                                </Text>
                                            </View>
                                        </View>
                                    ))}
                                </View>
                            </>
                        )}
                    </>
                ) : (
                    <View style={styles.card}>
                        <Text style={styles.emptyText}>Bu randevu için henüz bir tıbbi kayıt oluşturulmamıştır.</Text>
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eef0f3', backgroundColor: '#f8f9fa' },
    headerTitle: { fontSize: 20, fontFamily: 'Inter_18pt-SemiBold', color: '#1c1c1e' },
    scrollContainer: { padding: 20 },
    card: { backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 15, marginBottom: 20, shadowColor: '#a0a0a0', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
    sectionTitle: { fontSize: 18, fontFamily: 'Inter_18pt-SemiBold', color: '#1c2a3a', marginBottom: 10 },
    infoRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    infoTextContainer: { marginLeft: 15, flex: 1 },
    infoLabel: { fontSize: 13, fontFamily: 'Inter_18pt-Regular', color: '#6a788a', marginBottom: 2 },
    infoValue: { fontSize: 16, fontFamily: 'Inter_18pt-Medium', color: '#1c1c1e' },
    prescriptionItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, fontFamily: 'Inter_18pt-Regular', color: '#6a788a', textAlign: 'center', padding: 20 },
});

export default AppointmentDetailScreen;