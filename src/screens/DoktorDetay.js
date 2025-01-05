import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';
import BackgroundLogo from '../components/BackgroundLogo';

const DoktorDetay = ({ route, navigation }) => {
  const { doctor } = route.params;
  const [selectedDate, setSelectedDate] = useState('23');
  const [selectedTime, setSelectedTime] = useState('02:00 PM');

  const dates = [
    { day: 'Pzt', date: '21' },
    { day: 'Sal', date: '22' },
    { day: 'Çar', date: '23' },
    { day: 'Per', date: '24' },
    { day: 'Cum', date: '25' },
    { day: 'Cmt', date: '26' },
  ];

  const times = [
    '09:00',
    '10:00',
    '11:00',
    '14:00',
    '15:00',
    '16:00',
  ];

  return (
    <View style={styles.container}>
      <BackgroundLogo />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Doktor Detay - Randevu</Text>
        <TouchableOpacity>
          <MaterialIcons name="more-vert" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.doctorProfile}>
          <Image source={doctor.image} style={styles.doctorImage} />
          <Text style={styles.doctorName}>{doctor.name}</Text>
          <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
          <View style={styles.experienceInfo}>
            <MaterialIcons name="work" size={16} color="#008B8B" />
            <Text style={styles.experienceText}>{doctor.experience} yıl deneyim</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hakkında</Text>
          <Text style={styles.aboutText}>
            Kardiyoloji alanında uzmanlaşmış deneyimli bir hekim.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tarih Seçin</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.dateList}>
              {dates.map((item) => (
                <TouchableOpacity
                  key={item.date}
                  style={[
                    styles.dateItem,
                    selectedDate === item.date && styles.selectedDate,
                  ]}
                  onPress={() => setSelectedDate(item.date)}
                >
                  <Text style={[
                    styles.dateDay,
                    selectedDate === item.date && styles.selectedDateText
                  ]}>{item.day}</Text>
                  <Text style={[
                    styles.dateNumber,
                    selectedDate === item.date && styles.selectedDateText
                  ]}>{item.date}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Müsait Saatler</Text>
          <View style={styles.timeGrid}>
            {times.map((time) => (
              <TouchableOpacity
                key={time}
                style={[
                  styles.timeItem,
                  selectedTime === time && styles.selectedTime,
                ]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[
                  styles.timeText,
                  selectedTime === time && styles.selectedTimeText
                ]}>{time}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.messageButton}>
          <MaterialIcons name="chat" size={24} color="#008B8B" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>Randevu Al</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 40,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.inter.semiBold,
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  doctorProfile: {
    alignItems: 'center',
    marginBottom: 24,
  },
  doctorImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  doctorName: {
    fontSize: 24,
    fontFamily: FONTS.inter.semiBold,
    color: '#000',
    marginBottom: 8,
  },
  doctorSpecialty: {
    fontSize: 16,
    fontFamily: FONTS.inter.regular,
    color: '#666',
    marginBottom: 8,
  },
  experienceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  experienceText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: FONTS.inter.medium,
    color: '#666',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.inter.semiBold,
    color: '#000',
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    color: '#666',
    lineHeight: 22,
  },
  dateList: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  dateItem: {
    width: 60,
    height: 80,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 6,
  },
  selectedDate: {
    backgroundColor: '#008B8B',
  },
  dateDay: {
    fontSize: 14,
    fontFamily: FONTS.inter.medium,
    color: '#666',
    marginBottom: 4,
  },
  dateNumber: {
    fontSize: 18,
    fontFamily: FONTS.inter.semiBold,
    color: '#000',
  },
  selectedDateText: {
    color: '#fff',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },
  timeItem: {
    width: '31%',
    height: 45,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '1%',
    marginBottom: 12,
  },
  selectedTime: {
    backgroundColor: '#008B8B',
  },
  timeText: {
    fontSize: 14,
    fontFamily: FONTS.inter.medium,
    color: '#000',
  },
  selectedTimeText: {
    color: '#fff',
  },
  footer: {
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  messageButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  bookButton: {
    flex: 1,
    height: 50,
    backgroundColor: '#008B8B',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookButtonText: {
    fontSize: 14,
    fontFamily: FONTS.inter.semiBold,
    color: '#fff',
  },
});

export default DoktorDetay; 