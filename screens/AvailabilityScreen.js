import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";


export default class AvailabilityScreen extends DefaultScreen {
  static route = {
    navigationBar: {
      title: 'Step One: Availability',
    }
  };

  onNextTap() {
    //TODO: Update this line with the user's actual availability
    Database.setUserData(this.state.user.uid, {
      // Days of week: 0 = Sunday, 6 = Saturday
      availability: [0,1,2,3,4,5,6]
    });
    this.props.navigator.push(Router.getRoute('home'));
  }

  renderView() {
    return (
      <View
        style={styles.container}
      >
      <Button
        onPress={() => (this.onNextTap())}
        title="Next"
        color="#841584"
      />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
});