import React, {useCallback, useRef, useState} from 'react';
import {
    ActivityIndicator,
    Image,
    Modal,
    Platform,
    SafeAreaView,
    SectionList,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
// --- ADDED: useNavigation import ---
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {MaterialIcons} from '@expo/vector-icons';
import {Swipeable} from 'react-native-gesture-handler';
import BackButton from '../components/BackButton';
import Toast from 'react-native-toast-message';
import {cancelAppointment, getMyHistory} from '../services/appointmentService';

// Helper Functions (no change)
const formatAppointmentDate = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' });
};
const formatAppointmentTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
};
const defaultAvatar = {
    uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
};

const RandevuKarti = ({ randevu, onShowCancelModal, canCancel, isPast, isCancelled, isMissed, isScheduled, onPress }) => {
    const swipeableRef = useRef(null);
    const renderRightActions = () => (
        <View style={styles.rightAction}>
            <MaterialIcons name='delete' size={24} color='#fff' />
            <Text style={styles.actionText}>İptal Et</Text>
        </View>
    );

    const cardStyle = [
        styles.card,
        isPast && styles.pastCard,
        isCancelled && styles.cancelledCard,
        isMissed && styles.missedCard,
        randevu.status === 'COMPLETED' && styles.completedCard,
    ];
    const textStyle = (isPast || isCancelled || isMissed) && styles.pastText;
    const iconColor = (isPast || isCancelled || isMissed) ? '#8a9a9a' : '#008B8B';

    return (
        <TouchableOpacity onPress={onPress} disabled={randevu.status !== 'COMPLETED'}>
            <Swipeable
                ref={swipeableRef}
                renderRightActions={canCancel ? renderRightActions : null}
                onSwipeableRightOpen={() => onShowCancelModal(randevu.appointmentId)}
                overshootRight={false}
            >
                <View style={cardStyle}>
                    <View style={styles.cardContent}>
                        <Image source={defaultAvatar} style={styles.doctorImage} />
                        <View style={styles.cardInfo}>
                            <View style={styles.cardHeader}>
                                <Text style={[styles.doctorName, textStyle]}>{randevu.doctorFullName}</Text>
                                {isCancelled && (
                                    <View style={[styles.statusBadge, styles.cancelledBadge]}>
                                        <Text style={[styles.statusBadgeText, styles.cancelledBadgeText]}>İPTAL EDİLDİ</Text>
                                    </View>
                                )}
                                {isMissed && (
                                    <View style={[styles.statusBadge, styles.missedBadge]}>
                                        <Text style={[styles.statusBadgeText, styles.missedBadgeText]}>KAÇIRILDI</Text>
                                    </View>
                                )}
                                {randevu.status === 'COMPLETED' && (
                                    <View style={[styles.statusBadge, styles.completedBadge]}>
                                        <Text style={[styles.statusBadgeText, styles.completedBadgeText]}>TAMAMLANDI</Text>
                                    </View>
                                )}
                            </View>
                            <View style={[styles.cardBody, isPast && styles.pastCardBody]}>
                                <View style={styles.infoRow}>
                                    <MaterialIcons name='local-hospital' size={16} color={iconColor} />
                                    <Text style={[styles.department, textStyle]}>{randevu.clinicName}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <MaterialIcons name='event' size={16} color={iconColor} />
                                    <Text style={[styles.infoText, textStyle]}>{formatAppointmentDate(randevu.appointmentTime)}</Text>
                                </View>
                                <View style={styles.infoRow}>
                                    <MaterialIcons name='access-time' size={16} color={iconColor} />
                                    <Text style={[styles.infoText, textStyle]}>{formatAppointmentTime(randevu.appointmentTime)}</Text>
                                </View>
                            </View>
                            {isScheduled && (
                                <View style={styles.infoNoteContainer}>
                                    <MaterialIcons name="info-outline" size={14} color="#3b82f6" />
                                    <Text style={styles.infoNoteText}>15 dakika önceden hazır bulunmalısınız.</Text>
                                </View>
                            )}
                        </View>
                    </View>
                </View>
            </Swipeable>
        </TouchableOpacity>
    );
};

const RandevularScreen = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalVisible, setModalVisible] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState(null);
    const navigation = useNavigation();

    const fetchAppointments = useCallback(async () => {
        try {
            setLoading(true);
            const data = await getMyHistory();
            const now = new Date();
            const upcoming = [];
            const past = [];
            data.forEach(appt => {
                if (new Date(appt.appointmentTime) > now && appt.status === 'SCHEDULED') {
                    upcoming.push(appt);
                } else {
                    past.push(appt);
                }
            });
            setAppointments([
                { title: 'Gelecek Randevular', data: upcoming },
                { title: 'Geçmiş Randevular', data: past.sort((a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime)) },
            ]);
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Hata', text2: error.message });
        } finally {
            setLoading(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchAppointments();
        }, [fetchAppointments])
    );

    const showCancelModal = (id) => {
        setAppointmentToCancel(id);
        setModalVisible(true);
    };

    const confirmDeletion = async () => {
        if (!appointmentToCancel) return;
        try {
            await cancelAppointment(appointmentToCancel);
            Toast.show({ type: 'success', text1: 'Başarılı', text2: 'Randevunuz iptal edildi.' });
            fetchAppointments();
        } catch (error) {
            Toast.show({ type: 'error', text1: 'Hata', text2: error.message });
        } finally {
            setModalVisible(false);
            setAppointmentToCancel(null);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.header}>
                    <BackButton />
                    <Text style={styles.headerTitle}>Randevularım</Text>
                    <View style={{ width: 24 }} />
                </View>
                <ActivityIndicator style={{ flex: 1 }} size="large" color="#008B8B" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalIconContainer}>
                            <MaterialIcons name="delete-forever" size={32} color="#FF3B30" />
                        </View>
                        <Text style={styles.modalTitle}>Randevuyu İptal Et</Text>
                        <Text style={styles.modalText}>
                            Bu randevuyu kalıcı olarak iptal etmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </Text>
                        <View style={styles.modalActions}>
                            <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.modalButtonText}>Vazgeç</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={confirmDeletion}>
                                <Text style={[styles.modalButtonText, styles.confirmButtonText]}>Evet, İptal Et</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            <View style={styles.header}>
                <BackButton />
                <Text style={styles.headerTitle}>Randevularım</Text>
                <View style={{ width: 24 }} />
            </View>
            <SectionList
                sections={appointments}
                keyExtractor={(item) => item.appointmentId.toString()}
                renderItem={({ item, section }) => {
                    const isPast = section.title === 'Geçmiş Randevular';
                    const isCancelled = item.status === 'CANCELLED';
                    const isMissed = item.status === 'MISSED';
                    const isScheduled = item.status === 'SCHEDULED' && !isPast;
                    return (
                        <RandevuKarti
                            randevu={item}
                            onShowCancelModal={showCancelModal}
                            canCancel={!isPast && !isCancelled && !isMissed}
                            isPast={isPast}
                            isCancelled={isCancelled}
                            isMissed={isMissed}
                            isScheduled={isScheduled}
                            onPress={() => navigation.navigate('AppointmentDetail', { appointmentId: item.appointmentId })}
                        />
                    );
                }}
                renderSectionHeader={({ section: { title, data } }) => (
                    data.length > 0 ? <Text style={styles.sectionHeader}>{title}</Text> : null
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Henüz hiç randevunuz bulunmamaktadır.</Text>
                    </View>
                }
                contentContainerStyle={styles.listContainer}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#eef0f3', backgroundColor: '#f8f9fa' },
    headerTitle: { fontSize: 20, fontFamily: 'Inter_18pt-SemiBold', color: '#1c1c1e' },
    listContainer: { paddingHorizontal: 20, paddingBottom: 20 },
    sectionHeader: { fontSize: 18, fontFamily: 'Inter_18pt-SemiBold', color: '#1c2a3a', marginTop: 20, marginBottom: 10 },
    card: { backgroundColor: '#fff', borderRadius: 16, marginBottom: 15, shadowColor: '#a0a0a0', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
    pastCard: { backgroundColor: '#f8f9fa', shadowOpacity: 0.05, elevation: 2 },
    cancelledCard: { backgroundColor: '#fff5f5' },
    missedCard: { backgroundColor: '#fffbeb' },
    completedCard: { backgroundColor: '#f0fdf4' },
    cardContent: { flexDirection: 'row', padding: 15, borderRadius: 16, overflow: 'hidden' },
    doctorImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
    cardInfo: { flex: 1 },
    cardHeader: { marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    doctorName: { fontSize: 16, fontFamily: 'Inter_18pt-SemiBold', color: '#1c1c1e', marginBottom: 4, flex: 1 },
    department: { fontSize: 14, fontFamily: 'Inter_18pt-Regular', color: '#008B8B', marginLeft: 4 },
    cardBody: { backgroundColor: '#f8f9fa', borderRadius: 8, padding: 10 },
    pastCardBody: { backgroundColor: '#eef0f3' },
    infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
    infoText: { marginLeft: 8, fontSize: 14, fontFamily: 'Inter_18pt-Medium', color: '#6a788a' },
    pastText: { color: '#8a9a9a' },
    infoNoteContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 10, backgroundColor: '#eff6ff', padding: 8, borderRadius: 8 },
    infoNoteText: { fontSize: 12, fontFamily: 'Inter_18pt-Medium', color: '#3b82f6', marginLeft: 6 },
    rightAction: { backgroundColor: '#FF3B30', justifyContent: 'center', alignItems: 'center', width: 100, marginBottom: 15, borderTopRightRadius: 16, borderBottomRightRadius: 16 },
    actionText: { color: '#fff', fontFamily: 'Inter_18pt-Medium', fontSize: 14, marginTop: 4 },
    statusBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginLeft: 10 },
    statusBadgeText: { fontSize: 10, fontFamily: 'Inter_18pt-Bold' },
    cancelledBadge: { backgroundColor: '#ffe2e0' },
    cancelledBadgeText: { color: '#c9342b' },
    missedBadge: { backgroundColor: '#fef3c7' },
    missedBadgeText: { color: '#b45309' },
    completedBadge: { backgroundColor: '#dcfce7' },
    completedBadgeText: { color: '#166534' },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 },
    emptyText: { fontSize: 16, fontFamily: 'Inter_18pt-Regular', color: '#6a788a', textAlign: 'center' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
    modalContent: { backgroundColor: '#fff', borderRadius: 20, padding: 25, width: '100%', alignItems: 'center' },
    modalIconContainer: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ffeeed', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    modalTitle: { fontSize: 20, fontFamily: 'Inter_18pt-Bold', color: '#1c1c1e', marginBottom: 15, textAlign: 'center' },
    modalText: { fontSize: 16, fontFamily: 'Inter_18pt-Regular', color: '#3c4a5c', lineHeight: 24, marginBottom: 25, textAlign: 'center' },
    modalActions: { flexDirection: 'row' },
    modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center', backgroundColor: '#eef0f3' },
    confirmButton: { backgroundColor: '#FF3B30', marginLeft: 10 },
    modalButtonText: { fontSize: 16, fontFamily: 'Inter_18pt-SemiBold', color: '#3c4a5c' },
    confirmButtonText: { color: '#fff' },
});

export default RandevularScreen;