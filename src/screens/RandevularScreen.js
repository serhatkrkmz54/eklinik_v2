import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform, StatusBar } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';
import BackgroundLogo from '../components/BackgroundLogo';

const defaultAvatar = { uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' };

const TabButton = ({ title, isActive, onPress }) => (
  <TouchableOpacity 
    style={[styles.tabButton, isActive && styles.activeTabButton]} 
    onPress={onPress}
  >
    <Text style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const RandevuKarti = ({ doctor, specialty, date, time, status, onCancel, onReschedule }) => (
  <View style={styles.appointmentCard}>
    <View style={styles.appointmentHeader}>
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{doctor}</Text>
        <Text style={styles.doctorSpecialty}>{specialty}</Text>
      </View>
      <Image source={defaultAvatar} style={styles.doctorImage} />
    </View>
    
    <View style={styles.appointmentDetails}>
      <View style={styles.detailItem}>
        <MaterialIcons name="event" size={16} color="#666" />
        <Text style={styles.detailText}>{date}</Text>
      </View>
      <View style={styles.detailItem}>
        <MaterialIcons name="access-time" size={16} color="#666" />
        <Text style={styles.detailText}>{time}</Text>
      </View>
      <View style={styles.detailItem}>
        <MaterialIcons name="check-circle" size={16} color="#4CAF50" />
        <Text style={[styles.detailText, { color: '#4CAF50' }]}>Onaylandı</Text>
      </View>
    </View>

    <View style={styles.appointmentActions}>
      <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
        <Text style={styles.cancelButtonText}>İptal Et</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.rescheduleButton} onPress={onReschedule}>
        <Text style={styles.rescheduleButtonText}>Yeniden Planla</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const RandevularScreen = () => {
  const [aktifTab, setAktifTab] = useState('gelecek');

  const gelecekRandevular = [
    {
      doctor: 'Dr. Erdi Tüzün',
      specialty: 'Kardiyolog',
      date: '05/01/2025',
      time: '10:30 ÖÖ',
      status: 'onaylandı'
    },
    {
      doctor: 'Dr. Ersan CENGİZ',
      specialty: 'Psikiyatr',
      date: '06/01/2025',
      time: '16:30 ÖS',
      status: 'onaylandı'
    }
  ];

  const tamamlananRandevular = [];
  const iptalEdilenRandevular = [];

  const randevulariGoster = () => {
    let randevular = [];
    switch (aktifTab) {
      case 'gelecek':
        randevular = gelecekRandevular;
        break;
      case 'tamamlanan':
        randevular = tamamlananRandevular;
        break;
      case 'iptal':
        randevular = iptalEdilenRandevular;
        break;
    }

    return randevular.map((randevu, index) => (
      <RandevuKarti
        key={index}
        {...randevu}
        onCancel={() => {}}
        onReschedule={() => {}}
      />
    ));
  };

  return (
    <View style={styles.container}>
      <BackgroundLogo />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Randevularım</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <MaterialIcons name="notifications-none" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabContainer}>
        <TabButton
          title="Gelecek"
          isActive={aktifTab === 'gelecek'}
          onPress={() => setAktifTab('gelecek')}
        />
        <TabButton
          title="Tamamlanan"
          isActive={aktifTab === 'tamamlanan'}
          onPress={() => setAktifTab('tamamlanan')}
        />
        <TabButton
          title="İptal Edilen"
          isActive={aktifTab === 'iptal'}
          onPress={() => setAktifTab('iptal')}
        />
      </View>

      <View style={styles.appointmentList}>
        {randevulariGoster()}
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
  notificationButton: {
    padding: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 17,
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
  },
  activeTabButton: {
    backgroundColor: '#008B8B',
  },
  tabButtonText: {
    fontSize: 14,
    fontFamily: FONTS.inter.medium,
    color: '#666',
  },
  activeTabButtonText: {
    color: '#fff',
  },
  appointmentList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appointmentCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 14,
    fontFamily: FONTS.inter.semiBold,
    color: '#000',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    color: '#666',
  },
  doctorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  appointmentDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    marginLeft: 4,
    fontSize: 12,
    fontFamily: FONTS.inter.regular,
    color: '#666',
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontFamily: FONTS.inter.medium,
    color: '#666',
    textAlign: 'center',
  },
  rescheduleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#008B8B',
    marginLeft: 8,
  },
  rescheduleButtonText: {
    fontSize: 14,
    fontFamily: FONTS.inter.medium,
    color: '#fff',
    textAlign: 'center',
  },
});

export default RandevularScreen; 