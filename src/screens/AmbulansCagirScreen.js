import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Circle, Marker } from 'react-native-maps';
import { MaterialIcons } from '@expo/vector-icons';

const AmbulansCagirScreen = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [ambulanceInfo, setAmbulanceInfo] = useState(null);
  const [address, setAddress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const getAccurateLocation = async () => {
    try {
      setIsLoading(true);
      
      let quickLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      if (quickLocation) {
        setLocation(quickLocation);
        try {
          const quickAddress = await Location.reverseGeocodeAsync({
            latitude: quickLocation.coords.latitude,
            longitude: quickLocation.coords.longitude,
          });
          if (quickAddress[0]) setAddress(quickAddress[0]);
        } catch (error) {
          console.log('Hızlı adres çözümleme hatası:', error);
        }
      }

      let foregroundStatus = await Location.requestForegroundPermissionsAsync();
      if (foregroundStatus.status !== 'granted') {
        setErrorMsg('Konum izni gerekli');
        return;
      }

      const providerStatus = await Location.getProviderStatusAsync();
      if (!providerStatus.locationServicesEnabled) {
        setErrorMsg('Lütfen GPS servisini açın');
        return;
      }

      await Location.enableNetworkProviderAsync();
      

      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 0,
          timeInterval: 300,
        },
        async (newLocation) => {

          if (!location || newLocation.coords.accuracy < location.coords.accuracy) {
            setLocation(newLocation);

            try {
              const addressResponse = await Location.reverseGeocodeAsync({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
              });
              if (addressResponse[0]) setAddress(addressResponse[0]);
            } catch (error) {
              console.log('Adres çözümleme hatası:', error);
            }
          }

          if (newLocation.coords.accuracy < 15) {
            locationSubscription.remove();
            setIsLoading(false);
          }
        }
      );

      setTimeout(() => {
        locationSubscription.remove();
        setIsLoading(false);
      }, 10000);

    } catch (error) {
      setErrorMsg('Konum alınamadı: ' + error.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAccurateLocation();
  }, []);

  const handleCallAmbulance = () => {
    if (location) {
      const ambulanceInfo = {
        coordinates: location.coords,
        timestamp: new Date().toLocaleString(),
        accuracy: Math.round(location.coords.accuracy),
        address: address ? 
          `${address.street || ''} ${address.name || ''} ${address.district || ''} ${address.city || ''} ${address.region || ''}`.trim() : 
          'Adres bulunamadı'
      };

      setAmbulanceInfo(ambulanceInfo);
      setShowSuccessModal(true);
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
      {location ? (
        <MapView
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
          {isLoading ? (
            <>
              <ActivityIndicator size="large" color="#FF0000" />
              <Text style={styles.errorText}>En doğru konum alınıyor...</Text>
            </>
          ) : (
            <Text style={styles.errorText}>{errorMsg || 'Konum alınamadı'}</Text>
          )}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.callButton, !location && { opacity: 0.7 }]}
          onPress={handleCallAmbulance}
          disabled={!location}
        >
          <Text style={styles.callButtonText}>
            {isLoading ? 'Konum Alınıyor...' : 'Konuma Ambulans Çağır'}
          </Text>
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