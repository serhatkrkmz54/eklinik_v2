import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FONTS } from '../theme/fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const LoadingDots = () => {
  const animations = [
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
    useRef(new Animated.Value(0.3)).current,
  ];

  useEffect(() => {
    const animate = () => {
      const sequence = animations.map((anim, index) => {
        return Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0.3,
            duration: 500,
            useNativeDriver: true,
          }),
        ]);
      });

      Animated.loop(Animated.parallel(sequence)).start();
    };

    animate();
  }, []);

  return (
    <View style={styles.loadingDotsContainer}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.loadingDot,
            {
              backgroundColor: '#008B8B',
              opacity: anim,
              transform: [
                {
                  scale: anim.interpolate({
                    inputRange: [0.3, 1],
                    outputRange: [1, 1.5],
                  }),
                },
              ],
            },
          ]}
        />
      ))}
    </View>
  );
};

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        navigation.reset({
          index: 0,
          routes: [{ name: 'Welcome' }],
        });
        return;
      }

      const response = await axios.get('http://132.226.194.153/api/user/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // console.log('Data:', response.data);
      setUserData(response.data.data);
    } catch (error) {
      console.error('Kullanıcı bilgileri alınamadı:', error);
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: 'Kullanıcı bilgileri alınamadı',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      Toast.show({
        type: 'success',
        text1: 'Başarılı',
        text2: 'Çıkış yapıldı',
        position: 'top',
        visibilityTime: 2000,
      });
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Hata',
        text2: 'Çıkış yapılırken bir hata oluştu',
        position: 'top',
        visibilityTime: 3000,
      });
    }
  };

  const menuItems = [
    { id: 1, title: 'Randevularım', icon: 'event-note', route: 'Randevular' },
    {
      id: 2,
      title: 'Bilgilerimi Düzenle',
      icon: 'edit',
      route: 'PaymentMethods',
    },
    {
      id: 3,
      title: 'Çıkış Yap',
      icon: 'logout',
      route: 'Logout',
      color: '#FF4B55',
      onPress: handleLogout,
    },
  ];

  const getGenderIcon = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'male';
      case 'female':
        return 'female';
      default:
        return 'person';
    }
  };

  const getGenderText = (gender) => {
    switch (gender?.toLowerCase()) {
      case 'male':
        return 'Erkek';
      case 'female':
        return 'Kadın';
      default:
        return 'Belirtilmemiş';
    }
  };

  const getRoleStyle = (role) => {
    return {
      fontSize: 14,
      fontFamily: FONTS.inter.medium,
      color: role === 'doctor' ? '#008B8B' : '#FF4B55',
      backgroundColor: role === 'doctor' ? '#E6F3F3' : '#FFE6E8',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 20,
      marginTop: 5,
    };
  };

  const getRoleText = (role) => {
    return role === 'doctor' ? 'Doktor' : 'Hasta';
  };

  if (loading || !userData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <View style={styles.loadingContent}>
            <ActivityIndicator size='large' color='#008B8B' />
            <Image
              source={require('../../assets/medics-logo.png')}
              style={styles.loadingLogo}
              resizeMode='contain'
            />
            <Text style={styles.loadingText}>Bilgileriniz Yükleniyor...</Text>
            <LoadingDots />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={
                userData.profile_photo
                  ? { uri: userData.profile_photo }
                  : require('../../assets/default-user.jpg')
              }
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={getRoleStyle(userData.role)}>
            {getRoleText(userData.role)}
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialIcons name='person' size={24} color='#fff' />
            <Text style={styles.statLabel}>TCKN</Text>
            <Text style={styles.statValue}>{userData.tckn}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialIcons name='cake' size={24} color='#fff' />
            <Text style={styles.statLabel}>Doğum Tarihi</Text>
            <Text style={styles.statValue}>{userData.birth_date}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialIcons name='phone' size={24} color='#fff' />
            <Text style={styles.statLabel}>Telefon</Text>
            <Text style={styles.statValue}>{userData.phone}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <MaterialIcons
              name={getGenderIcon(userData.gender)}
              size={24}
              color='#fff'
            />
            <Text style={styles.statLabel}>Cinsiyet</Text>
            <Text style={styles.statValue}>
              {getGenderText(userData.gender)}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.menuItem}
            onPress={item.onPress || (() => navigation.navigate(item.route))}
          >
            <View style={styles.menuIconContainer}>
              <MaterialIcons
                name={item.icon}
                size={24}
                color={item.color || '#20B2AA'}
              />
            </View>
            <Text
              style={[styles.menuText, item.color && { color: item.color }]}
            >
              {item.title}
            </Text>
            <MaterialIcons name='chevron-right' size={24} color='#CCCCCC' />
          </TouchableOpacity>
        ))}
      </View>
      <Toast />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#20B2AA',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLogo: {
    width: 100,
    height: 100,
    marginVertical: 20,
    tintColor: '#008B8B',
  },
  loadingText: {
    fontSize: 16,
    color: '#008B8B',
    fontFamily: FONTS.inter.medium,
    marginTop: 10,
  },
  loadingDotsContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    opacity: 0.6,
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
