import React, { useState } from 'react';
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
  Pressable,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';
import BackButton from '../components/BackButton';
import { Picker } from '@react-native-picker/picker';

const defaultAvatar = {
  uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
};

const poliklinikler = [
  { id: 'tumu', name: 'Tüm Poliklinikler' },
  { id: 'kardiyoloji', name: 'Kardiyoloji' },
  { id: 'psikoloji', name: 'Psikoloji' },
  { id: 'ortopedi', name: 'Ortopedi' },
];

const doctors = [
  {
    id: '1',
    name: 'Dr. Ersan CENGİZ',
    specialty: 'Kardiyolog',
    image: defaultAvatar,
    poliklinik: 'kardiyoloji',
  },
  {
    id: '2',
    name: 'Dr. Serhat KORKMAZ',
    specialty: 'Psikolog',
    image: defaultAvatar,
    poliklinik: 'psikoloji',
  },
  {
    id: '3',
    name: 'Dr. Mehmet KAYA',
    specialty: 'Ortopedist',
    image: defaultAvatar,
    poliklinik: 'ortopedi',
  },
  {
    id: '4',
    name: 'Dr. Ahmet ELLİ',
    specialty: 'Ortopedist',
    image: defaultAvatar,
    poliklinik: 'ortopedi',
  },
  {
    id: '5',
    name: 'Dr. Erdi TÜZÜN',
    specialty: 'Kardiyoloji',
    image: defaultAvatar,
    poliklinik: 'kardiyoloji',
  },
  {
    id: '6',
    name: 'Dr. Ersan CENGİZ',
    specialty: 'Kardiyolog',
    image: defaultAvatar,
    poliklinik: 'kardiyoloji',
  },
];

const DoctorCard = ({ doctor, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={doctor.image} style={styles.doctorImage} />
    <View style={styles.doctorInfo}>
      <Text style={styles.doctorName}>{doctor.name}</Text>
      <Text style={styles.specialty}>{doctor.specialty}</Text>
    </View>
  </TouchableOpacity>
);

const TumDoktorlarEkrani = ({ navigation }) => {
  const [selectedPoliklinik, setSelectedPoliklinik] = useState('tumu');

  const handleDoctorPress = (doctor) => {
    navigation.navigate('DoktorDetay', { doctor });
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      selectedPoliklinik === 'tumu' || doctor.poliklinik === selectedPoliklinik
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#fff' />
      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <BackButton />
          <Text style={styles.headerTitle}>Tüm Doktorlarımız</Text>
          <MaterialIcons name='more-vert' size={24} color='#000' />
        </View>

        <View style={styles.pickerContainer}>
          <View style={styles.pickerWrapper}>
            <View style={styles.selectedValueContainer}>
              <Text style={styles.selectedValue}>
                {poliklinikler.find((p) => p.id === selectedPoliklinik)?.name}
              </Text>
              <MaterialIcons name='arrow-drop-down' size={24} color='#008B8B' />
            </View>
            <Picker
              selectedValue={selectedPoliklinik}
              onValueChange={(itemValue) => setSelectedPoliklinik(itemValue)}
              style={[
                styles.picker,
                {
                  opacity: 0,
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                },
              ]}
            >
              {poliklinikler.map((poliklinik) => (
                <Picker.Item
                  key={poliklinik.id}
                  label={poliklinik.name}
                  value={poliklinik.id}
                />
              ))}
            </Picker>
          </View>
        </View>

        <FlatList
          data={filteredDoctors}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <DoctorCard doctor={item} onPress={() => handleDoctorPress(item)} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.flatListContent}
          style={styles.flatList}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.inter.semiBold,
    color: '#000',
  },
  pickerContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  pickerWrapper: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#008B8B',
  },
  selectedValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 50,
  },
  selectedValue: {
    fontSize: 16,
    fontFamily: FONTS.inter.medium,
    color: '#008B8B',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  flatList: {
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },
  card: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  doctorInfo: {
    marginLeft: 15,
    flex: 1,
    justifyContent: 'center',
  },
  doctorName: {
    fontSize: 16,
    fontFamily: FONTS.inter.semiBold,
    color: '#000',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    color: '#666',
    fontFamily: FONTS.inter.regular,
  },
});

export default TumDoktorlarEkrani;
