import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { FONTS } from '../theme/fonts';
import Toast from 'react-native-toast-message';
import BackButton from '../components/BackButton';
import { MaterialIcons } from '@expo/vector-icons';

import { getDoctorsByClinic } from '../services/clinicService';

const defaultAvatar = {
  uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
};

const DoctorCard = ({ doctor, onPress }) => {
  if (!doctor || !doctor.user || !doctor.clinic) {
    return null;
  }

  return (
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
        <Image
            source={doctor.user.imageUrl ? { uri: doctor.user.imageUrl } : defaultAvatar}
            style={styles.doctorImage}
            onError={(e) => e.target.source = defaultAvatar}
        />
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{`${doctor.title} ${doctor.user.firstName} ${doctor.user.lastName}`}</Text>
          <Text style={styles.specialty}>{doctor.clinic.name}</Text>
        </View>
        <View style={styles.actionIcon}>
          <MaterialIcons name="chevron-right" size={28} color="#008B8B" />
        </View>
      </TouchableOpacity>
  );
};

const DoktorlarScreen = ({ route, navigation }) => {
  const { clinicId, clinicName } = route.params;

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!clinicId) return;

      try {
        setLoading(true);
        const data = await getDoctorsByClinic(clinicId);
        if (Array.isArray(data)) {
          setDoctors(data);
        } else {
          console.error("API'den doktorlar için bir dizi dönmedi:", data);
          setDoctors([]);
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Hata',
          text2: error.message || 'Doktorlar getirilirken bir sorun oluştu.',
        });
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [clinicId]);

  const handleDoctorPress = (doctor) => {
    navigation.navigate('DoktorDetay', { doctorId: doctor.doctorId });
  };

  const renderContent = () => {
    if (loading) {
      return <ActivityIndicator style={styles.loader} size="large" color="#008B8B" />;
    }

    return (
        <FlatList
            data={doctors}
            keyExtractor={(item, index) => (item && item.doctorId ? item.doctorId.toString() : index.toString())}
            renderItem={({ item }) => (
                <DoctorCard doctor={item} onPress={() => handleDoctorPress(item)} />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatListContent}
            style={styles.flatList}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>Bu poliklinikte henüz doktor bulunmamaktadır.</Text>
              </View>
            }
        />
    );
  };

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle='dark-content' backgroundColor='#f7f8fa' />
        <View style={styles.mainContainer}>
          <View style={styles.header}>
            <BackButton />
            <Text style={styles.headerTitle}>{clinicName}</Text>
            <View style={{ width: 40 }} />
          </View>

          {renderContent()}

        </View>
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa', // Arka plan rengi güncellendi
  },
  mainContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 10,
    paddingBottom: 10,
    backgroundColor: '#f7f8fa', // Arka plan rengi güncellendi
    borderBottomWidth: 1,
    borderBottomColor: '#eef0f3',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.inter.semiBold,
    color: '#1c1c1e',
    textAlign: 'center',
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 16, // Köşeler daha yuvarlak
    marginBottom: 15,
    shadowColor: '#a0a0a0', // Gölge rengi daha yumuşak
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1, // Gölge opaklığı
    shadowRadius: 12,   // Gölge yarıçapı
    elevation: 5,
  },
  doctorImage: {
    width: 70, // Resim boyutu ayarlandı
    height: 70,
    borderRadius: 12, // Resim köşeleri
    backgroundColor: '#f0f0f0',
  },
  doctorInfo: {
    marginLeft: 15,
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontFamily: FONTS.inter.semiBold,
    color: '#1c1c1e',
    marginBottom: 5, // Boşluk ayarlandı
  },
  specialty: {
    fontSize: 14,
    color: '#6a6a6e', // Renk güncellendi
    fontFamily: FONTS.inter.regular,
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.inter.regular,
    color: '#6a6a6e',
    textAlign: 'center',
  }
});

export default DoktorlarScreen;
