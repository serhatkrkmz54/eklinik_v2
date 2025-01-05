import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { FONTS } from '../theme/fonts';

const DoktorKarti = ({ 
  image, 
  name, 
  specialty, 
  experience, 
  onPress 
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.doctorImage} />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.name} numberOfLines={1}>{name}</Text>
        <Text style={styles.specialty} numberOfLines={1}>{specialty}</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <MaterialIcons name="work" size={16} color="#008B8B" />
            <Text style={styles.statText}>{experience} yıl deneyim</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
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
  imageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: 12,
  },
  doctorImage: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontFamily: FONTS.inter.semiBold,
    color: '#000',
    marginBottom: 4,
  },
  specialty: {
    fontSize: 14,
    fontFamily: FONTS.inter.regular,
    color: '#666',
    marginBottom: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statText: {
    fontSize: 12,
    fontFamily: FONTS.inter.medium,
    color: '#666',
    marginLeft: 4,
  },
});

export default DoktorKarti; 