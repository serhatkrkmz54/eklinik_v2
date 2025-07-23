import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  ActivityIndicator,
  FlatList,
  TextInput,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FONTS } from '../theme/fonts';
import Toast from 'react-native-toast-message';
import { MaterialIcons } from '@expo/vector-icons';

import { getAllClinics } from '../services/clinicService';
import { getMyProfile } from '../services/userService';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const clinicImageMap = {
  'algoloji': require('../../assets/poliklinikler/algoloji.png'),
  'beyin cerrahı': require('../../assets/poliklinikler/beyincerrahi.png'),
  'kadın doğum': require('../../assets/poliklinikler/kadindogum.png'),
  'kadın hastalıkları': require('../../assets/poliklinikler/kadindogum.png'),
  'biyokimya': require('../../assets/poliklinikler/biyokimya.png'),
  'dahiliye': require('../../assets/poliklinikler/dahiliye.png'),
  'göğüs hastalıkları': require('../../assets/poliklinikler/goguscerrahi.png'),
  'cildiye': require('../../assets/poliklinikler/cildiye.png'),
  'psikiyatri': require('../../assets/poliklinikler/psikiyatri.png'),
  'kardiyoloji': require('../../assets/poliklinikler/kardiyoloji.png'),
  'çocuk hastalıkları': require('../../assets/poliklinikler/cocukhastaliklari.png'),
  'göz hastalıkları': require('../../assets/poliklinikler/gozhastaliklari.png'),
  'fizik tedavi': require('../../assets/poliklinikler/fiziktedvereh.png'),
  'nöroloji': require('../../assets/poliklinikler/noroloji.png'),
  'ortopedi': require('../../assets/poliklinikler/ortopedivetravmatoloji.png'),
  'kulak burun boğaz': require('../../assets/poliklinikler/kulakburunbogaz.png'),
  'üroloji': require('../../assets/poliklinikler/uroloji.png'),
  default: require('../../assets/medics-logo.png')
};

const getClinicImage = (name) => {
  if (!name) return clinicImageMap.default;
  const normalizedName = name.toLowerCase().trim();
  return clinicImageMap[normalizedName] || clinicImageMap.default;
};

const PoliklinikItem = React.memo(({ iconSource, title, onPress }) => (
    <TouchableOpacity style={styles.poliklinikItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.poliklinikItemContent}>
        <View style={styles.poliklinikIconWrapper}>
          <Image source={iconSource} style={styles.poliklinikImage} resizeMode="contain" />
        </View>
        <Text style={styles.poliklinikTitle} numberOfLines={2}>{title}</Text>
      </View>
    </TouchableOpacity>
));

const QuickActionCard = React.memo(({ icon, label, onPress }) => (
    <TouchableOpacity style={styles.quickActionCard} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.quickActionCardContent}>
        <View style={styles.quickActionIconWrapper}>
          <MaterialIcons name={icon} size={26} color="#008B8B" />
        </View>
        <Text style={styles.quickActionLabel}>{label}</Text>
      </View>
    </TouchableOpacity>
));

const ScreenHeader = React.memo(({ userName, inputValue, onSearchChange, navigation }) => {
  return (
      <>
        <View style={styles.header}>
          <Text style={styles.headerGreeting}>Merhaba{userName ? `, ${userName}` : ''}!</Text>
          <Text style={styles.headerTitle}>Size nasıl yardımcı olabiliriz?</Text>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Hızlı İşlemler</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.quickActionsContainer}>
            <QuickActionCard icon="emergency" label="Acil Servis" onPress={() => navigation.navigate('AmbulansCagir')} />
            <QuickActionCard icon="science" label="Sonuçlarım" onPress={() => Toast.show({type: 'info', text1: 'Yakında'})} />
            <QuickActionCard icon="vaccines" label="Aşı Takvimi" onPress={() => Toast.show({type: 'info', text1: 'Yakında'})} />
            <QuickActionCard icon="payment" label="Ödemeler" onPress={() => Toast.show({type: 'info', text1: 'Yakında'})} />
          </ScrollView>
        </View>

        <Text style={styles.sectionTitle}>Tüm Poliklinikler</Text>
        <View style={styles.searchContainer}>
          <View style={styles.searchInputWrapper}>
            <MaterialIcons name="search" size={22} color="#8e8e93" style={styles.searchIcon} />
            <TextInput
                style={styles.searchInput}
                placeholder="Bölüm veya poliklinik ara..."
                placeholderTextColor="#8e8e93"
                value={inputValue}
                onChangeText={onSearchChange}
            />
          </View>
        </View>
      </>
  );
});


const PolikliniklerScreen = () => {
  const navigation = useNavigation();
  const [clinics, setClinics] = useState([]);
  const [filteredClinics, setFilteredClinics] = useState([]);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
      useCallback(() => {
        const fetchInitialData = async () => {
          try {
            setLoading(true);
            const [clinicsData, profileData] = await Promise.all([
              getAllClinics(),
              getMyProfile()
            ]);

            setClinics(clinicsData);
            setFilteredClinics(clinicsData);

            if (profileData && profileData.firstName) {
              setUserName(profileData.firstName);
            }

          } catch (error) {
            Toast.show({ type: 'error', text1: 'Hata', text2: "Veriler yüklenemedi." });
          } finally {
            setLoading(false);
          }
        };
        fetchInitialData();
      }, [])
  );

  useEffect(() => {
    const WEBSOCKET_URL = 'http://192.168.1.33:8080/ws';
    const client = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      onConnect: () => {
        client.subscribe('/topic/clinics', (message) => {
          try {
            const newClinic = JSON.parse(message.body);
            setClinics(prev => {
              if (prev.some(c => c.id === newClinic.id)) return prev;
              const updatedClinics = [newClinic, ...prev].sort((a, b) => a.name.localeCompare(b.name));
              if (searchQuery.trim() === '') {
                setFilteredClinics(updatedClinics);
              }
              return updatedClinics;
            });
          } catch (e) { console.error("WebSocket mesajı parse edilemedi:", e); }
        });
      },
    });
    client.activate();
    return () => { if (client) client.deactivate(); };
  }, [searchQuery]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredClinics(clinics);
    } else {
      const filtered = clinics.filter(clinic =>
          clinic.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredClinics(filtered);
    }
  }, [searchQuery, clinics]);

  const renderItem = useCallback(({ item }) => (
      <PoliklinikItem
          iconSource={getClinicImage(item.name)}
          title={item.name}
          onPress={() => navigation.navigate('Doktorlar', {
            clinicId: item.id,
            clinicName: item.name
          })}
      />
  ), [navigation]);

  return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#f0f4f8" />
        {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#008B8B" />
            </View>
        ) : (
            <FlatList
                key="poliklinik-list"
                data={filteredClinics}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                ListHeaderComponent={
                  <ScreenHeader
                      userName={userName}
                      inputValue={searchQuery}
                      onSearchChange={setSearchQuery}
                      navigation={navigation}
                  />
                }
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                columnWrapperStyle={styles.row}
                ListEmptyComponent={
                  <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>Aramanızla eşleşen poliklinik bulunamadı.</Text>
                  </View>
                }
            />
        )}
      </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f8',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 10,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 40,
    paddingBottom: 20,
  },
  headerGreeting: {
    fontSize: 18,
    fontFamily: FONTS.inter.regular,
    color: '#6a788a',
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: FONTS.inter.bold,
    color: '#1c2a3a',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.inter.semiBold,
    color: '#1c2a3a',
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  quickActionsContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  quickActionCard: {
    marginRight: 15,
  },
  quickActionCardContent: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    width: 100,
    shadowColor: '#9cb0c9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  quickActionIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e6f3f3',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionLabel: {
    fontSize: 13,
    fontFamily: FONTS.inter.medium,
    color: '#344356',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#dde3ea',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontSize: 16,
    fontFamily: FONTS.inter.regular,
    color: '#1c2a3a',
  },
  listContent: {
    paddingHorizontal: 10,
    paddingBottom: 125,
  },
  row: {
    justifyContent: 'space-between',
  },
  poliklinikItem: {
    flex: 0.5,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  poliklinikItemContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#9cb0c9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  poliklinikIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#f0f4f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  poliklinikImage: {
    width: '65%',
    height: '65%',
  },
  poliklinikTitle: {
    fontSize: 14,
    fontFamily: FONTS.inter.semiBold,
    color: '#344356',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FONTS.inter.regular,
    color: '#6a788a',
    textAlign: 'center',
  }
});

export default PolikliniklerScreen;
