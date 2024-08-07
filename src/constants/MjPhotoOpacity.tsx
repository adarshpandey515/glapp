import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const GoldIteamIcon = () => {
  return (
  
      <Image
        source={require('../assests/images/mj.jpeg')} // Adjust the path as necessary
        style={styles.icon}
        
      />

  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    opacity: 0.4,
    width: 120,  // Adjust the size as needed
    height: 120,
    color: 'black', // Adjust the color as needed
  },
});

export default GoldIteamIcon;
