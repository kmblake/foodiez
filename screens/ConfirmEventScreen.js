import React from 'react';
import { StyleSheet, Text, TextInput , View, Button, ListView, TouchableOpacity, TouchableHighlight, DatePickerIOS } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import { Container, Content, Item, Input } from 'native-base';

export default class CreateEventScreen extends DefaultScreen {
  static route = {
    navigationBar: {
      title: 'Confirm Event Details',
    }
  };

  

  constructor(props) {
    super(props);
    const event = JSON.parse(props.route.params.event);  
    const invitedFriends = JSON.parse(props.route.params.invitedFriends);  
   
    this.state = {
      logged_in: true, 
      event: event,
      invitedFriends: invitedFriends
    };
  }

  onNextTap() {
    Database.createEvent(this.state.event, this.state.invitedFriends);
    this.props.navigator.push(Router.getRoute('home'));
  }


  renderView() {
    return (  
      <View
        style={styles.container}
      >
      <Text style={styles.text}>
        {this.state.event.type} ({this.state.event.id}) Host: {this.state.event.host.name}
      </Text>
    
      
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
  }
});