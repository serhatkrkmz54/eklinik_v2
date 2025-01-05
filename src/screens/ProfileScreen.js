import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../theme/fonts';

const ProfileScreen = () => {
  const navigation = useNavigation();

  const userData = {
    name: 'Serhat KORKMAZ',
    height: '180cm',
    age: '25',
    weight: '75kg',
    gender: 'Erkek'
  };

  const menuItems = [
    { id: 1, title: 'Randevularım', icon: 'event-note', route: 'Randevular' },
    { id: 2, title: 'Bilgilerimi Düzenle', icon: 'edit', route: 'PaymentMethods' },
    { id: 3, title: 'Çıkış Yap', icon: 'logout', route: 'Logout', color: '#FF4B55' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/300' }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialIcons name="height" size={24} color="#fff" />
            <Text style={styles.statLabel}>Boy</Text>
            <Text style={styles.statValue}>{userData.height}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialIcons name="person" size={24} color="#fff" />
            <Text style={styles.statLabel}>Yaş</Text>
            <Text style={styles.statValue}>{userData.age}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialIcons name="monitor-weight" size={24} color="#fff" />
            <Text style={styles.statLabel}>Kilo</Text>
            <Text style={styles.statValue}>{userData.weight}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialIcons name="wc" size={24} color="#fff" />
            <Text style={styles.statLabel}>Cinsiyet</Text>
            <Text style={styles.statValue}>{userData.gender}</Text>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.route)}
          >
            <View style={styles.menuIconContainer}>
              <MaterialIcons
                name={item.icon}
                size={24}
                color={item.color || '#20B2AA'}
              />
            </View>
            <Text style={[styles.menuText, item.color && { color: item.color }]}>
              {item.title}
            </Text>
            <MaterialIcons name="chevron-right" size={24} color="#CCCCCC" />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20B2AA',
  },
  header: {
    backgroundColor: '#20B2AA',
    paddingTop: 40,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    padding: 2,
    marginBottom: 10,
  },
  profileImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  userName: {
    fontSize: 20,
    color: '#fff',
    fontFamily: FONTS.poppins.semiBold,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  statLabel: {
    color: '#fff',
    fontSize: 12,
    marginTop: 5,
    opacity: 0.8,
    fontFamily: FONTS.poppins.regular,
  },
  statValue: {
    color: '#fff',
    fontSize: 14,
    fontFamily: FONTS.poppins.medium,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    backgroundColor: '#F8F8F8',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    fontFamily: FONTS.poppins.regular,
  },
});

export default ProfileScreen; 