import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const BackgroundLogo = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/medics-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  logo: {
    width: width * 0.7,
    height: width * 0.7,
    opacity: 0.07,
    tintColor: '#008B8B',
  },
});

export default BackgroundLogo; 