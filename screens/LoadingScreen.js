import React from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';

export default class ViewEventScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Image 
          style={styles.icon}
          source={require('../assets/images/foodiez-icon.png')}
        />
        <Image
          source={require('../assets/images/logo.png')}
        />
        <Text style={styles.slogan}>Not your mom's dinner party</Text>
        <ActivityIndicator
          animating={true}
          style={[styles.centering, {height: 80}]}
          size="large"
          color='white'
        />
      </View>
    );
  }



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#219653',
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 100,
    height: 100,
    marginBottom: 10
  },
  slogan: {
    marginTop: 10,
    color: 'white',
    fontStyle: 'italic'
  }
});