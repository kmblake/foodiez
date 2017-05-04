import React from 'react';
import { StyleSheet, View, Button, TouchableHighlight } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import {
  MKCheckbox,
} from 'react-native-material-kit';
import { Container, Content, List, ListItem, Text, CheckBox } from 'native-base';


export default class AvailabilityScreen extends DefaultScreen {
  constructor(props) {
    super(props);
    this.state = {availability: []};
  }

  static route = {
    navigationBar: {
      title: 'Step One: Availability',
    }
  };

  availability: [];

  onNextTap() {
    console.log(this.state.availability)
    //TODO: Update this line with the user's actual availability
    Database.setUserData(this.state.user.uid, {
      // Days of week: 0 = Sunday, 6 = Saturday
      availability: this.state.availability
    });
    this.props.navigator.push(Router.getRoute('addFriends'));
  }

  toggleAvailability(day) {
    index = this.state.availability.indexOf(day);
    if (index > 0)
      this.state.availability.splice(1, index);
    else
      this.state.availability.push(day);
  }


  renderView() {


    return (
      <View style={styles.container}>
        <View style={styles.datePicker}>
          <Button
            onPress={() => (this.toggleAvailability(0))}
            title="Su"
            color="#841584"
          />
          <Button
            onPress={() => (this.toggleAvailability(1))}
            title="M"
            color="#841584"
          />
          <Button
            onPress={() => (this.toggleAvailability(2))}
            title="Tu"
            color="#841584"
          />
          <Button
            onPress={() => (this.toggleAvailability(3))}
            title="W"
            color="#841584"
          />
          <Button
            onPress={() => (this.toggleAvailability(4))}
            title="Th"
            color="#841584"
          />
          <Button
            onPress={() => (this.toggleAvailability(5))}
            title="F"
            color="#841584"
          />
          <Button
            onPress={() => (this.toggleAvailability(6))}
            title="S"
            color="#841584"
          />
        </View>
        <View style={styles.container} >
          <Button
            onPress={() => (this.onNextTap())}
            title="Next"
            color="#841584"
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  datePicker: {
    paddingTop: '50%',
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between'
  }
});