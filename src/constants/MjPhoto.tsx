import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const MJphoto = () => {
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
    width: 90,  // Adjust the size as needed
    height: 90,
    color: 'black', // Adjust the color as needed
  },
});

export default MJphoto;
