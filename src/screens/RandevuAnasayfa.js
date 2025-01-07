import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
  Image,
  SafeAreaView,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';
import DoktorKarti from '../components/DoktorKarti';
import BackgroundLogo from '../components/BackgroundLogo';

const defaultAvatar = {
  uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
};

const CategoryItem = ({ icon, title }) => (
  <TouchableOpacity style={styles.categoryItem}>
    <View style={styles.categoryIcon}>{icon}</View>
    <Text style={styles.categoryTitle}>{title}</Text>
  </TouchableOpacity>
);

const RecentDoctorItem = ({ image, name }) => (
  <TouchableOpacity style={styles.recentDoctorItem}>
    <View style={styles.recentDoctorImageContainer}>
      <Image source={image} style={styles.recentDoctorImage} />
    </View>
    <Text style={styles.recentDoctorName} numberOfLines={1}>
      {name}
    </Text>
  </TouchableOpacity>
);

const RandevuAnasayfa = ({ navigation }) => {
  // const categories = [
  //   { icon: <MaterialIcons name="medical-services" size={24} color="#008B8B" />, title: "Genel" },
  //   { icon: <MaterialIcons name="coronavirus" size={24} color="#008B8B" />, title: "Göğüs Hastalıkları" },
  //   { icon: <MaterialIcons name="healing" size={24} color="#008B8B" />, title: "Diş" },
  //   { icon: <MaterialIcons name="psychology" size={24} color="#008B8B" />, title: "Psikiyatri" },
  //   { icon: <MaterialIcons name="coronavirus" size={24} color="#008B8B" />, title: "Covid-19" },
  //   { icon: <MaterialIcons name="local-hospital" size={24} color="#008B8B" />, title: "Cerrah" },
  //   { icon: <MaterialIcons name="favorite" size={24} color="#008B8B" />, title: "Kardiyolog" },
  // ];

  const recentDoctors = [
    { id: 1, image: defaultAvatar, name: 'Dr. Serhat' },
    { id: 2, image: defaultAvatar, name: 'Dr. Ersan' },
    { id: 3, image: defaultAvatar, name: 'Dr. Ahmet' },
    { id: 4, image: defaultAvatar, name: 'Dr. Mehmet' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle='dark-content' backgroundColor='#fff' />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name='arrow-back' size={24} color='#000' />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Randevu</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <BackgroundLogo />

        <View style={styles.searchContainer}>
          <MaterialIcons name='search' size={20} color='#666' />
          <TextInput
            style={styles.searchInput}
            placeholder='Doktor veya Poliklinik Ara...'
            placeholderTextColor='#666'
          />
        </View>
        {/* 
        <Text style={styles.sectionTitle}>Category</Text>
        <View style={styles.categoryGrid}>
          {categories.map((item, index) => (
            <CategoryItem key={index} icon={item.icon} title={item.title} />
          ))}
        </View> */}

        <Text style={styles.sectionTitle}>Önerilen Doktorlar</Text>
        <View style={{ paddingHorizontal: 20 }}>
          <DoktorKarti
            image={defaultAvatar}
            name='Dr. Erdi TÜZÜN'
            specialty='Kardiyolog'
            experience={8}
            onPress={() =>
              navigation.navigate('DoktorDetay', {
                doctor: {
                  image: defaultAvatar,
                  name: 'Dr. Erdi TÜZÜN',
                  specialty: 'Kardiyolog',
                  experience: 8,
                },
              })
            }
          />
        </View>

        <Text style={styles.sectionTitle}>Geçmiş Randevularınız</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.recentDoctorsScroll}
        >
          {recentDoctors.map((doctor) => (
            <RecentDoctorItem
              key={doctor.id}
              image={doctor.image}
              name={doctor.name}
            />
          ))}
        </ScrollView>

        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Tüm Doktorlarımız</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('TumDoktorlarEkrani')}
              style={styles.seeAllButton}
            >
              <Text style={styles.seeAllText}>Tümünü Gör</Text>
              <MaterialIcons
                name='arrow-forward-ios'
                size={14}
                color='#008B8B'
              />
            </TouchableOpacity>
          </View>

          <View style={styles.allDoctorsContainer}>
            <TouchableOpacity
              style={styles.doctorsCard}
              onPress={() => navigation.navigate('TumDoktorlarEkrani')}
            >
              <View style={styles.doctorsCardContent}>
                <MaterialIcons name='people' size={24} color='#008B8B' />
                <Text style={styles.doctorsCardText}>
                  Uzman doktorlarımızla tanışın
                </Text>
              </View>
              <MaterialIcons name='arrow-forward-ios' size={20} color='#666' />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  headerRight: {
    width: 24,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    color: '#000',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.inter.semiBold,
    color: '#000',
    marginBottom: 15,
    marginTop: 20,
    marginHorizontal: 20,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 15,
  },
  categoryItem: {
    width: '25%',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 12,
    fontFamily: FONTS.inter.regular,
    color: '#666',
    textAlign: 'center',
  },
  recentDoctorsScroll: {
    paddingHorizontal: 20,
  },
  recentDoctorItem: {
    alignItems: 'center',
    marginRight: 20,
    width: 80,
  },
  recentDoctorImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    marginBottom: 8,
  },
  recentDoctorImage: {
    width: '100%',
    height: '100%',
  },
  recentDoctorName: {
    fontSize: 12,
    fontFamily: FONTS.inter.medium,
    color: '#666',
    textAlign: 'center',
  },
  sectionContainer: {
    paddingVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5,
  },
  seeAllText: {
    fontSize: 14,
    color: '#008B8B',
    marginRight: 5,
    fontFamily: FONTS.inter.medium,
  },
  doctorsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  doctorsCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorsCardText: {
    fontSize: 16,
    color: '#000',
    marginLeft: 15,
    fontFamily: FONTS.inter.medium,
  },
  allDoctorsContainer: {
    paddingHorizontal: 20,
  },
});

export default RandevuAnasayfa;
