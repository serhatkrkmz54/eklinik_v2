import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../theme/fonts';
import BackgroundLogo from '../components/BackgroundLogo';

const PoliklinikItem = ({ icon, title, onPress }) => (
  <TouchableOpacity 
    style={styles.poliklinikItem} 
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View style={styles.poliklinikIcon}>
      {icon}
    </View>
    <Text style={styles.poliklinikTitle} numberOfLines={2}>{title}</Text>
  </TouchableOpacity>
);

const PolikliniklerScreen = () => {
  const navigation = useNavigation();

  const poliklinikler = [
    { icon: require('../../assets/poliklinikler/algoloji.png'), title: "Algoloji" },
    { icon: require('../../assets/poliklinikler/beyincerrahi.png'), title: "Beyin Cerrahı" },
    { icon: require('../../assets/poliklinikler/kadindogum.png'), title: "Kadın Doğum" },
    { icon: require('../../assets/poliklinikler/biyokimya.png'), title: "BiyoKimya" },
    { icon: require('../../assets/poliklinikler/dahiliye.png'), title: "Dahiliye" },
    { icon: require('../../assets/poliklinikler/goguscerrahi.png'), title: "Göğüs Hastalıkları" },
    { icon: require('../../assets/poliklinikler/cildiye.png'), title: "Cildiye" },
    { icon: require('../../assets/poliklinikler/psikiyatri.png'), title: "Psikiyatri" },
    { icon: require('../../assets/poliklinikler/kardiyoloji.png'), title: "Kardiyoloji" },
    { icon: require('../../assets/poliklinikler/cocukhastaliklari.png'), title: "Çocuk Hastalıkları" },
    { icon: require('../../assets/poliklinikler/gozhastaliklari.png'), title: "Göz Hastalıkları" },
    { icon: require('../../assets/poliklinikler/fiziktedvereh.png'), title: "Fizik Tedavi" },
    { icon: require('../../assets/poliklinikler/noroloji.png'), title: "Nöroloji" },
    { icon: require('../../assets/poliklinikler/kadindogum.png'), title: "Kadın Hastalıkları" },
    { icon: require('../../assets/poliklinikler/ortopedivetravmatoloji.png'), title: "Ortopedi" },
    { icon: require('../../assets/poliklinikler/kulakburunbogaz.png'), title: "Kulak Burun Boğaz" }
  ];

  return (
    <View style={styles.container}>
        <BackgroundLogo />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Poliklinikler - Hızlı Randevu</Text>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.poliklinikGrid}>
          {poliklinikler.map((item, index) => (
            <PoliklinikItem
              key={index}
              icon={<Image source={item.icon} style={styles.poliklinikImage} resizeMode="contain" />}
              title={item.title}
              onPress={() => navigation.navigate('Randevu')}
            />
          ))}
        </View>
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
    justifyContent: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 40,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.inter.semiBold,
    color: '#000',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  poliklinikGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
  },
  poliklinikItem: {
    width: '30%',
    aspectRatio: 0.9,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  poliklinikIcon: {
    width: '100%',
    height: '65%',
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    padding: 8,
  },
  poliklinikTitle: {
    fontSize: 12,
    fontFamily: FONTS.inter.medium,
    color: '#000',
    textAlign: 'center',
  },
  poliklinikImage: {
    width: '100%',
    height: '100%',
  },
});

export default PolikliniklerScreen; 