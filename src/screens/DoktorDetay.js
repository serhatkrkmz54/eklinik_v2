import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  Modal, // Alert yerine Modal kullanacağız
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';
import Toast from 'react-native-toast-message';
import { getDoctorById, getSlotsByDoctorAndDate, bookAppointment } from '../services/doctorService';
import BackButton from '../components/BackButton';

// Yardımcı Fonksiyonlar
const formatDateForApi = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `${year}-${month}-${day}`;
};

const formatTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
};

const defaultAvatar = {
  uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
};

const DoktorDetayScreen = ({ route, navigation }) => {
  const { doctorId } = route.params;

  const [doctor, setDoctor] = useState(null);
  const [slots, setSlots] = useState([]);
  const [calendarDates, setCalendarDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false); // Modal için state
  const [isBooking, setIsBooking] = useState(false); // Randevu alınıyor durumu

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const doctorData = await getDoctorById(doctorId);
        setDoctor(doctorData);

        const availableDays = [];
        let currentDate = new Date();

        while (availableDays.length < 7) {
          const formattedDate = formatDateForApi(currentDate);
          const slotsForDay = await getSlotsByDoctorAndDate(doctorData.doctorId, formattedDate);

          const isToday = currentDate.toDateString() === new Date().toDateString();
          const hasFutureSlots = slotsForDay.some(slot => new Date(slot.startTime) > new Date());

          if ((isToday && hasFutureSlots) || (!isToday && slotsForDay.length > 0)) {
            availableDays.push(new Date(currentDate));
          }

          currentDate.setDate(currentDate.getDate() + 1);
        }

        setCalendarDates(availableDays);
        if (availableDays.length > 0) {
          setSelectedDate(availableDays[0]);
        }

      } catch (error) {
        Toast.show({ type: 'error', text1: 'Hata', text2: "Doktor bilgileri veya takvim yüklenemedi." });
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [doctorId]);

  useEffect(() => {
    if (!doctor || !selectedDate) return;

    const fetchSlots = async () => {
      try {
        setSlotsLoading(true);
        setSelectedSlot(null);
        const formattedDate = formatDateForApi(selectedDate);
        const allSlots = await getSlotsByDoctorAndDate(doctor.doctorId, formattedDate);
        setSlots(allSlots);
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Hata', text2: error.message });
        setSlots([]);
      } finally {
        setSlotsLoading(false);
      }
    };
    fetchSlots();
  }, [selectedDate, doctor]);

  const handleBookingPress = () => {
    if (!selectedSlot) return;
    setModalVisible(true); // Alert yerine modalı göster
  };

  const confirmBooking = async () => {
    if (!selectedSlot) return;
    try {
      setIsBooking(true);
      await bookAppointment(selectedSlot.id);
      Toast.show({
        type: 'success',
        text1: 'Randevu Başarılı!',
        text2: `Randevunuz başarıyla oluşturuldu.`
      });

      const formattedDate = formatDateForApi(selectedDate);
      const updatedSlots = await getSlotsByDoctorAndDate(doctor.doctorId, formattedDate);
      setSlots(updatedSlots);
      setSelectedSlot(null);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Hata', text2: error.message });
    } finally {
      setIsBooking(false);
      setModalVisible(false);
    }
  };

  if (loading) {
    return <View style={styles.loaderContainer}><ActivityIndicator size="large" color="#008B8B" /></View>;
  }

  if (!doctor) {
    return <View style={styles.loaderContainer}><Text>Doktor bilgileri bulunamadı.</Text></View>;
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
                <MaterialIcons name="event-available" size={32} color="#008B8B" />
              </View>
              <Text style={styles.modalTitle}>Randevuyu Onayla</Text>
              {selectedSlot && (
                  <Text style={styles.modalText}>
                    <Text style={{fontFamily: FONTS.inter.bold}}>{`${doctor.title} ${doctor.user.firstName} ${doctor.user.lastName}`}</Text> için
                    <Text style={{fontFamily: FONTS.inter.bold, color: '#008B8B'}}> {doctor.clinic.name}</Text> polikliniğinde,
                    <Text style={{fontFamily: FONTS.inter.bold}}> {selectedDate.toLocaleDateString('tr-TR', {day: 'numeric', month: 'long'})} - {formatTime(selectedSlot.startTime)}</Text> saatine randevu almak üzeresiniz.
                  </Text>
              )}
              <View style={styles.modalActions}>
                <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalButtonText}>İptal</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={confirmBooking} disabled={isBooking}>
                  {isBooking ? <ActivityIndicator color="#fff" /> : <Text style={[styles.modalButtonText, styles.confirmButtonText]}>Onayla</Text>}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>Doktor Detayı</Text>
          <View style={{ width: 40 }}/>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.doctorProfileCard}>
              <Image
                  source={doctor.user.imageUrl ? { uri: doctor.user.imageUrl } : defaultAvatar}
                  style={styles.doctorImage}
              />
              <Text style={styles.doctorName}>{`${doctor.title} ${doctor.user.firstName} ${doctor.user.lastName}`}</Text>
              <Text style={styles.doctorSpecialty}>{doctor.clinic.name}</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tarih Seçin</Text>
              <FlatList
                  horizontal
                  data={calendarDates}
                  keyExtractor={(item) => item.toISOString()}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({ item }) => {
                    const isSelected = selectedDate && selectedDate.toDateString() === item.toDateString();
                    return (
                        <TouchableOpacity
                            style={[styles.dateItem, isSelected && styles.selectedDate]}
                            onPress={() => setSelectedDate(item)}
                        >
                          <Text style={[styles.dateDay, isSelected && styles.selectedDateText]}>
                            {item.toLocaleDateString('tr-TR', { weekday: 'short' })}
                          </Text>
                          <Text style={[styles.dateNumber, isSelected && styles.selectedDateText]}>
                            {item.getDate()}
                          </Text>
                        </TouchableOpacity>
                    );
                  }}
                  contentContainerStyle={{ paddingHorizontal: 20 }}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Müsait Saatler</Text>
              {slotsLoading ? (
                  <ActivityIndicator style={{ marginTop: 20 }} color="#008B8B" />
              ) : (
                  <View style={styles.timeGrid}>
                    {slots.length > 0 ? slots.map((slot) => {
                      const isSelected = selectedSlot?.id === slot.id;
                      const isBooked = slot.status === 'BOOKED';
                      const isToday = selectedDate && selectedDate.toDateString() === new Date().toDateString();
                      const isPast = isToday && new Date(slot.startTime) < new Date();

                      return (
                          <TouchableOpacity
                              key={slot.id}
                              style={[
                                styles.timeItem,
                                (isBooked || isPast) && styles.bookedTime,
                                isSelected && styles.selectedTime
                              ]}
                              onPress={() => setSelectedSlot(slot)}
                              disabled={isBooked || isPast}
                          >
                            <Text style={[
                              styles.timeText,
                              (isBooked || isPast) && styles.bookedTimeText,
                              isSelected && styles.selectedTimeText
                            ]}>
                              {formatTime(slot.startTime)}
                            </Text>
                          </TouchableOpacity>
                      );
                    }) : (
                        <Text style={styles.noSlotsText}>Bu tarih için müsait randevu bulunmamaktadır.</Text>
                    )}
                  </View>
              )}
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={[styles.bookButton, !selectedSlot && styles.disabledButton]} onPress={handleBookingPress} disabled={!selectedSlot}>
            <Text style={styles.bookButtonText}>Randevu Al</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    backgroundColor: '#f8f9fa',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.inter.semiBold,
    color: '#1c1c1e',
  },
  content: {
    paddingBottom: 120,
  },
  doctorProfileCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginHorizontal: 20,
    marginTop: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#a0a0a0',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
  },
  doctorImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
    borderWidth: 4,
    borderColor: '#f8f9fa',
  },
  doctorName: {
    fontSize: 22,
    fontFamily: FONTS.inter.bold,
    color: '#1c2a3a',
    marginBottom: 4,
    textAlign: 'center',
  },
  doctorSpecialty: {
    fontSize: 16,
    fontFamily: FONTS.inter.medium,
    color: '#6a788a',
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.inter.semiBold,
    color: '#1c2a3a',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  dateItem: {
    width: 65,
    height: 90,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#eef0f3',
  },
  selectedDate: {
    backgroundColor: '#008B8B',
    borderColor: '#008B8B',
    transform: [{ scale: 1.0 }],
  },
  dateDay: {
    fontSize: 14,
    fontFamily: FONTS.inter.medium,
    color: '#6a788a',
    marginBottom: 8,
  },
  dateNumber: {
    fontSize: 22,
    fontFamily: FONTS.inter.bold,
    color: '#1c2a3a',
  },
  selectedDateText: {
    color: '#fff',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  timeItem: {
    width: '31%',
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eef0f3',
    marginRight: '2.33%',
  },
  selectedTime: {
    backgroundColor: '#008B8B',
    borderColor: '#008B8B',
  },
  bookedTime: {
    backgroundColor: '#f0f4f8',
    borderColor: '#dde3ea',
  },
  timeText: {
    fontSize: 15,
    fontFamily: FONTS.inter.semiBold,
    color: '#1c2a3a',
  },
  selectedTimeText: {
    color: '#fff',
  },
  bookedTimeText: {
    color: '#b0b8c1',
    textDecorationLine: 'line-through',
  },
  noSlotsText: {
    width: '100%',
    textAlign: 'center',
    fontSize: 15,
    fontFamily: FONTS.inter.regular,
    color: '#6a788a',
    marginTop: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eef0f3',
  },
  bookButton: {
    height: 50,
    backgroundColor: '#008B8B',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#a9d9d9',
  },
  bookButtonText: {
    fontSize: 16,
    fontFamily: FONTS.inter.bold,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    width: '100%',
    alignItems: 'center',
  },
  modalIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e6f3f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FONTS.inter.bold,
    color: '#1c2a3a',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    fontFamily: FONTS.inter.regular,
    color: '#3c4a5c',
    lineHeight: 24,
    marginBottom: 25,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#eef0f3',
  },
  confirmButton: {
    backgroundColor: '#008B8B',
    marginLeft: 10,
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: FONTS.inter.semiBold,
    color: '#3c4a5c',
  },
  confirmButtonText: {
    color: '#fff',
  },
});

export default DoktorDetayScreen;
