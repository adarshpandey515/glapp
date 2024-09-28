import { View, Text, ActivityIndicator, StyleSheet } from 'react-native'
import React from 'react'

const Nloader = () => {
    const styles = StyleSheet.create({
        loadingContainer: {
          position: 'absolute', // Overlay on top of everything
          top: 0,
         
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center', // Center the content vertically
          alignItems: 'center', // Center the content horizontally
          backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        },
      });
  return (
    <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading ...</Text>
      </View>
  )
}

export default Nloader