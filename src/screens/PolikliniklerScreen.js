import React, {useState, useCallback, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { FONTS } from '../theme/fonts';
import BackgroundLogo from '../components/BackgroundLogo';
import Toast from 'react-native-toast-message';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// GÜNCELLENDİ: Yeni oluşturduğumuz servisi import ediyoruz
import { getAllClinics } from '../services/clinicService';

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
  // Eşleşme bulunamazsa kullanılacak varsayılan resim
  default: require('../../assets/medics-logo.png')
};

// GÜNCELLENDİ: Klinik ismine göre doğru resmi bulan yardımcı fonksiyon
const getClinicImage = (name) => {
  if (!name) return clinicImageMap.default;
  const normalizedName = name.toLowerCase().trim();
  return clinicImageMap[normalizedName] || clinicImageMap.default;
};

const PoliklinikItem = ({ iconSource, title, onPress }) => (
    <TouchableOpacity style={styles.poliklinikItem} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.poliklinikIcon}>
        <Image source={iconSource} style={styles.poliklinikImage} resizeMode="contain" />
      </View>
      <Text style={styles.poliklinikTitle} numberOfLines={2}>{title}</Text>
    </TouchableOpacity>
);

const PolikliniklerScreen = () => {
  const navigation = useNavigation();
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClinics = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllClinics();
      setClinics(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Hata', text2: error.message });
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(fetchClinics);

  useEffect(() => {
    const WEBSOCKET_URL = '[http://192.168.1.34:8080/ws](http://192.168.1.34:8080/ws)'; // DİKKAT: Kendi IP adresinizi yazın.

    const client = new Client({
      webSocketFactory: () => new SockJS(WEBSOCKET_URL),
      debug: (str) => {
        console.log(new Date(), str);
      },
      onConnect: () => {
        console.log('WebSocket bağlantısı kuruldu.');
        client.subscribe('/topic/clinics', (message) => {
          try {
            const newClinic = JSON.parse(message.body);
            console.log('Yeni klinik bilgisi alındı:', newClinic);
            setClinics(prevClinics => {
              if (prevClinics.some(c => c.id === newClinic.id)) {
                return prevClinics;
              }
              return [newClinic, ...prevClinics];
            });
          } catch (e) {
            console.error("Gelen WebSocket mesajı parse edilemedi:", e);
          }
        });
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    client.activate();

    return () => {
      if (client) {
        client.deactivate();
        console.log('WebSocket bağlantısı kapatıldı.');
      }
    };
  }, []);

  return (
      <View style={styles.container}>
        <BackgroundLogo />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Poliklinikler - Hızlı Randevu</Text>
        </View>

        {loading ? (
            <ActivityIndicator style={{ flex: 1 }} size="large" color="#008B8B" />
        ) : (
            <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
              <View style={styles.poliklinikGrid}>
                {/* GÜNCELLENDİ: API'den gelen dinamik veri ile render ediliyor */}
                {clinics.map((item) => (
                    <PoliklinikItem
                        key={item.id}
                        iconSource={getClinicImage(item.name)}
                        title={item.name}
                        onPress={() => navigation.navigate('Randevu')} // TODO: Burayı ilgili kliniğin doktorlarını listeleyecek şekilde güncelleyebilirsiniz.
                    />
                ))}
              </View>
            </ScrollView>
        )}
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
    paddingBottom: 40,
  },
  poliklinikGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
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
