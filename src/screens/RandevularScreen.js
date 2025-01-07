import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
  Platform,
  Alert,
  Image,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';
import { Swipeable } from 'react-native-gesture-handler';
import BackButton from '../components/BackButton';

const defaultAvatar = {
  uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
};

const randevular = [
  {
    id: '1',
    doktor: 'Dr. Ersan CENGİZ',
    bolum: 'Kardiyoloji',
    tarih: '10 Ocak 2024',
    saat: '14:30',
    image: defaultAvatar,
  },
  {
    id: '2',
    doktor: 'Dr. Serhat KORKMAZ',
    bolum: 'Psikoloji',
    tarih: '12 Ocak 2024',
    saat: '10:15',
    image: defaultAvatar,
  },
  {
    id: '3',
    doktor: 'Dr. Mehmet KAYA',
    bolum: 'Ortopedi',
    tarih: '15 Ocak 2024',
    saat: '09:00',
    image: defaultAvatar,
  },
];

const RandevuKarti = ({ randevu, onDelete, onReschedule }) => {
  const swipeableRef = useRef(null);

  useEffect(() => {
    return () => {
      if (swipeableRef.current) {
        swipeableRef.current.close();
      }
    };
  }, []);

  const renderRightActions = (progress, dragX) => {
    return (
      <View style={styles.rightAction}>
        <MaterialIcons name='delete' size={24} color='#fff' />
        <Text style={styles.actionText}>Sil</Text>
      </View>
    );
  };

  const renderLeftActions = (progress, dragX) => {
    return (
      <View style={styles.leftAction}>
        <MaterialIcons name='event' size={24} color='#fff' />
        <Text style={styles.actionText}>Yeniden Planla</Text>
      </View>
    );
  };

  const handleRightOpen = () => {
    Alert.alert(
      'Randevu İptal Et',
      'Bu randevuyu iptal etmek istediğinize emin misiniz?',
      [
        {
          text: 'Hayır',
          style: 'cancel',
          onPress: () => swipeableRef.current.close(),
        },
        {
          text: 'Evet',
          onPress: () => {
            onDelete(randevu.id);
            swipeableRef.current.close();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleLeftOpen = () => {
    onReschedule(randevu);
    swipeableRef.current.close();
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderRightActions={renderRightActions}
      renderLeftActions={renderLeftActions}
      onSwipeableRightOpen={handleRightOpen}
      onSwipeableLeftOpen={handleLeftOpen}
      overshootLeft={false}
      overshootRight={false}
    >
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Image source={randevu.image} style={styles.doctorImage} />
          <View style={styles.cardInfo}>
            <View style={styles.cardHeader}>
              <Text style={styles.doctorName}>{randevu.doktor}</Text>
              <View style={styles.departmentContainer}>
                <MaterialIcons
                  name='local-hospital'
                  size={16}
                  color='#008B8B'
                />
                <Text style={styles.department}>{randevu.bolum}</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.infoRow}>
                <MaterialIcons name='event' size={16} color='#008B8B' />
                <Text style={styles.infoText}>{randevu.tarih}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialIcons name='access-time' size={16} color='#008B8B' />
                <Text style={styles.infoText}>{randevu.saat}</Text>
              </View>
              <View style={styles.warningContainer}>
                <MaterialIcons name='info' size={16} color='#FFA500' />
                <Text style={styles.warningText}>
                  Lütfen randevunuzdan 15 dakika önce hastanemizde hazır
                  bulunun.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    </Swipeable>
  );
};

const RandevularScreen = ({ navigation }) => {
  const [appointments, setAppointments] = useState(randevular);

  const handleDelete = (id) => {
    setAppointments(appointments.filter((randevu) => randevu.id !== id));
  };

  const handleReschedule = (randevu) => {
    navigation.navigate('Randevu', { rescheduleData: randevu });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#fff' />
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Randevularım</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RandevuKarti
            randevu={item}
            onDelete={handleDelete}
            onReschedule={handleReschedule}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
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
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.inter.semiBold,
    color: '#000',
  },
  listContainer: {
    padding: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    marginHorizontal: 2,
    marginVertical: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  cardContent: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
  },
  doctorImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    marginBottom: 10,
  },
  doctorName: {
    fontSize: 16,
    fontFamily: FONTS.inter.semiBold,
    color: '#000',
    marginBottom: 4,
  },
  departmentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  department: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    color: '#008B8B',
    marginLeft: 4,
  },
  cardBody: {
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    padding: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: FONTS.inter.medium,
    color: '#666',
  },
  rightAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    marginBottom: 15,
    marginTop: 2,
    marginRight: 2,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  leftAction: {
    backgroundColor: '#008B8B',
    justifyContent: 'center',
    alignItems: 'center',
    width: 100,
    marginBottom: 15,
    marginTop: 2,
    marginLeft: 2,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  actionText: {
    color: '#fff',
    fontFamily: FONTS.inter.medium,
    fontSize: 14,
    marginTop: 4,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  warningText: {
    marginLeft: 8,
    fontSize: 12,
    fontFamily: FONTS.inter.regular,
    color: '#FFA500',
    flex: 1,
  },
});

export default RandevularScreen;
