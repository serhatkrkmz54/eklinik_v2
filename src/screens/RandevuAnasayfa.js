import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, StatusBar, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';
import DoktorKarti from '../components/DoktorKarti';
import BackgroundLogo from '../components/BackgroundLogo';

const defaultAvatar = { uri: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png' };

const CategoryItem = ({ icon, title }) => (
  <TouchableOpacity style={styles.categoryItem}>
    <View style={styles.categoryIcon}>
      {icon}
    </View>
    <Text style={styles.categoryTitle}>{title}</Text>
  </TouchableOpacity>
);

const RecentDoctorItem = ({ image, name }) => (
  <TouchableOpacity style={styles.recentDoctorItem}>
    <View style={styles.recentDoctorImageContainer}>
      <Image source={image} style={styles.recentDoctorImage} />
    </View>
    <Text style={styles.recentDoctorName} numberOfLines={1}>{name}</Text>
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
    <View style={styles.container}>
      <BackgroundLogo />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Randevu - Anasayfa</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Randevu İçin Doktor veya Poliklinik Ara..."
            placeholderTextColor="#666"
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
        <DoktorKarti
          image={defaultAvatar}
          name="Dr. Erdi TÜZÜN"
          specialty="Kardiyolog"
          experience={8}
          onPress={() => navigation.navigate('DoktorDetay', {
            doctor: {
              image: defaultAvatar,
              name: "Dr. Erdi TÜZÜN",
              specialty: "Kardiyolog",
              experience: 8
            }
          })}
        />

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
      </ScrollView>
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
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 40,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.inter.semiBold,
    color: '#000',
    marginLeft: 15,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 140,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
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
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: -5,
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
    marginLeft: -5,
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
});

export default RandevuAnasayfa; 