import React from 'react';
import { StyleSheet, Text, View, Button, ListView, TouchableOpacity } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";


export default class CreateEventScreen extends DefaultScreen {
  static route = {
    navigationBar: {
      title: 'What\'s for Dinner?',
    }
  };

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const eventTypes = ['BBQ', 'Tapas Night', 'Picnic', 'Dinner']
    this.state = {
      logged_in: false, 
      date: new Date(props.route.params.date),
      eventType: 'Dinner',
      eventTypes: eventTypes,
      description: "Test description",
      location: "Test location"
    };
  }

  onNextTap() {
    const invitedFriends = this.state.invitedFriends
    const dateString = this.state.date.toString();
    const event = {
      type: this.state.eventType,
      date: this.state.date.getTime(),
      description: this.state.description,
      location: this.state.location,
      host: this.state.user.uid,
      attending: [this.state.user.uid]
    };
    Database.createEvent(event, JSON.parse(this.props.route.params.invitedFriends));
    this.props.navigator.push(Router.getRoute('home'));
  }

  renderView() {
    // Add date picker
    return (
      <View
        style={styles.container}
      >

      <Text>TODO: enter event details here</Text>
      <Button
        onPress={() => (this.onNextTap())}
        title="Create Event"
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