import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Circle, Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';
import api from '../services/api'; // Bu yolu kendi projenize göre düzenleyin
import Toast from 'react-native-toast-message';

const AmbulansCagirScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ambulanceInfo, setAmbulanceInfo] = useState(null);
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCalling, setIsCalling] = useState(false);

  const locationSubscription = useRef(null);
  const timeoutId = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const startLocationTracking = async () => {
      try {
        setIsLoading(true);
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Konum izni verilmedi.');
          setIsLoading(false);
          return;
        }

        const providerStatus = await Location.getProviderStatusAsync();
        if (!providerStatus.locationServicesEnabled) {
          setErrorMsg('Lütfen telefonunuzun konum (GPS) servisini açın.');
          setIsLoading(false);
          return;
        }

        let initialLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        setLocation(initialLocation);
        setIsLoading(false);

        Location.reverseGeocodeAsync({
          latitude: initialLocation.coords.latitude,
          longitude: initialLocation.coords.longitude,
        }).then(addressResponse => {
          if (addressResponse[0]) setAddress(addressResponse[0]);
        });

        locationSubscription.current = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.BestForNavigation,
              timeInterval: 1000,
              distanceInterval: 1,
            },
            (newLocation) => {
              setLocation(newLocation);
              mapRef.current?.animateToRegion({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002,
              }, 1000);
              if (newLocation.coords.accuracy < 20) {
                stopLocationTracking();
              }
            }
        );

        timeoutId.current = setTimeout(() => {
          stopLocationTracking();
        }, 15000);

      } catch (error) {
        console.error("❌ Konum alma sırasında kritik hata:", error);
        setErrorMsg('Konum alınamadı.');
        setIsLoading(false);
      }
    };

    const stopLocationTracking = () => {
      locationSubscription.current?.remove();
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };

    startLocationTracking();
    return () => stopLocationTracking();
  }, []);

  const handleCallAmbulance = async () => {
    if (!location) return;
    setIsCalling(true);

    const formattedAddress = address
        ? `${address.street || ''} ${address.name || ''} ${address.district || ''} ${address.city || ''} ${address.region || ''}`.trim()
        : 'Adres bulunamadı';

    const payload = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      address: formattedAddress,
      accuracy: Math.round(location.coords.accuracy),
    };

    try {
      await api.post('/emergency/call', payload);
      const info = {
        coordinates: location.coords,
        timestamp: new Date().toLocaleString(),
        accuracy: Math.round(location.coords.accuracy),
        address: formattedAddress
      };
      setAmbulanceInfo(info);
      setShowSuccessModal(true);
    } catch (error) {
      // DÜZELTME: Hatanın tüm detaylarını konsola yazdırıyoruz.
      // Lütfen terminaldeki bu çıktıyı benimle paylaş.
      console.error("❌ AMBULANS ÇAĞRI HATASI:", JSON.stringify(error.response, null, 2));

      Toast.show({
        type: 'error',
        text1: 'Çağrı Gönderilemedi',
        text2: error.response?.data?.message || 'Acil durum çağrısı gönderilirken bir hata oluştu.'
      });
    } finally {
      setIsCalling(false);
    }
  };

  const SuccessModal = () => (
      <Modal
          animationType="fade"
          transparent={true}
          visible={showSuccessModal}
          onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.iconContainer}>
              <MaterialIcons name="local-hospital" size={40} color="#fff" />
            </View>
            <Text style={styles.modalTitle}>Konuma Ambulans Çağırıldı!</Text>
            <View style={styles.infoContainer}>
              <Text style={styles.infoLabel}>Adres:</Text>
              <Text style={styles.infoText}>{ambulanceInfo?.address}</Text>
              <Text style={styles.infoLabel}>Koordinatlar:</Text>
              <Text style={styles.infoText}>
                {ambulanceInfo?.coordinates.latitude.toFixed(6)}, {ambulanceInfo?.coordinates.longitude.toFixed(6)}
              </Text>
              <Text style={styles.infoLabel}>Konum Doğruluğu:</Text>
              <Text style={styles.infoText}>{ambulanceInfo?.accuracy} metre</Text>
              <Text style={styles.infoLabel}>Çağrı Zamanı:</Text>
              <Text style={styles.infoText}>{ambulanceInfo?.timestamp}</Text>
            </View>
            <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setShowSuccessModal(false)}
            >
              <Text style={styles.modalButtonText}>Tamam</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
  );

  return (
      <View style={styles.container}>
        {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF0000" />
              <Text style={styles.errorText}>Konum bilgisi alınıyor...</Text>
            </View>
        ) : location ? (
            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                  latitudeDelta: 0.002,
                  longitudeDelta: 0.002,
                }}
            >
              <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
              />
              <Circle
                  center={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  radius={location.coords.accuracy || 50}
                  strokeColor="rgba(255, 0, 0, 0.5)"
                  fillColor="rgba(255, 0, 0, 0.1)"
              />
            </MapView>
        ) : (
            <View style={styles.loadingContainer}>
              <Text style={styles.errorText}>{errorMsg || 'Konum alınamadı'}</Text>
            </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
              style={[styles.callButton, (!location || isCalling) && { opacity: 0.7 }]}
              onPress={handleCallAmbulance}
              disabled={!location || isCalling}
          >
            {isCalling ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.callButtonText}>
                  Konuma Ambulans Çağır
                </Text>
            )}
          </TouchableOpacity>
        </View>

        <SuccessModal />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
  },
  callButton: {
    backgroundColor: '#FF0000',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  callButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    width: '90%',
    maxHeight: '80%',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF0000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    width: '100%',
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  modalButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 12,
    width: '100%',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default AmbulansCagirScreen;
