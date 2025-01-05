import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BackButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity 
      style={styles.backButton}
      onPress={() => navigation.goBack()}
    >
      <MaterialIcons name="arrow-back-ios" size={24} color="#000" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    padding: 10,
    marginLeft: -10,
  },
});

export default BackButton; 