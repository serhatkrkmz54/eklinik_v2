import React from 'react';
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
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';
import BackButton from '../components/BackButton';

const defaultAvatar = {
  uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
};

const doctors = [
  {
    id: '1',
    name: 'Dr. Marcus Horizon',
    specialty: 'Chardiologist',
    rating: 4.7,
    distance: '800m away',
    image: defaultAvatar,
  },
  {
    id: '2',
    name: 'Dr. Maria Elena',
    specialty: 'Psychologist',
    rating: 4.7,
    distance: '800m away',
    image: defaultAvatar,
  },
  {
    id: '3',
    name: 'Dr. Stefi Jessi',
    specialty: 'Orthopedist',
    rating: 4.7,
    distance: '800m away',
    image: defaultAvatar,
  },
  {
    id: '4',
    name: 'Dr. Gerty Cori',
    specialty: 'Orthopedist',
    rating: 4.7,
    distance: '800m away',
    image: defaultAvatar,
  },
  {
    id: '5',
    name: 'Dr. Diandra',
    specialty: 'Orthopedist',
    rating: 4.7,
    distance: '800m away',
    image: defaultAvatar,
  },
];

const DoctorCard = ({ doctor, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={doctor.image} style={styles.doctorImage} />
    <View style={styles.doctorInfo}>
      <Text style={styles.doctorName}>{doctor.name}</Text>
      <Text style={styles.specialty}>{doctor.specialty}</Text>
      <View style={styles.ratingContainer}>
        <MaterialIcons name='star' size={16} color='#FFD700' />
        <Text style={styles.rating}>{doctor.rating}</Text>
      </View>
      <View style={styles.distanceContainer}>
        <MaterialIcons name='location-on' size={14} color='#666' />
        <Text style={styles.distance}>{doctor.distance}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const TopDoctorsScreen = ({ navigation }) => {
  const handleDoctorPress = (doctor) => {
    navigation.navigate('DoktorDetay', { doctor });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#fff' />
      <View style={styles.header}>
        <BackButton />
        <Text style={styles.headerTitle}>Top Doctor</Text>
        <MaterialIcons name='more-vert' size={24} color='#000' />
      </View>

      <FlatList
        data={doctors}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DoctorCard doctor={item} onPress={() => handleDoctorPress(item)} />
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
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
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: '#000',
    fontFamily: FONTS.inter.medium,
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    marginLeft: 4,
    fontSize: 12,
    color: '#666',
    fontFamily: FONTS.inter.regular,
  },
});

export default TopDoctorsScreen;
