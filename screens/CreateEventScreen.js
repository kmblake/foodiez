import React from 'react';
import { StyleSheet, Text, TextInput , View, Button, ListView, TouchableOpacity } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import { Container, Content, Item, Input } from 'native-base';

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
    const curUser = {
        name: this.state.user.displayName,
        uid: this.state.user.uid,
        photoURL: this.state.user.photoURL
    };
    const event = {
      type: this.state.eventType,
      date: this.state.date.getTime(),
      description: this.state.description,
      location: this.state.location,
      host: curUser,
      attending: [curUser]
    };
    console.log(event);
    console.log(this.state);
    Database.createEvent(event, JSON.parse(this.props.route.params.invitedFriends));
    this.props.navigator.push(Router.getRoute('home'));
  }

  renderView() {
    // Add date picker
    return (  
      <View
        style={styles.container}
      >
      <Item regular>
        <Input 
          placeholder='Description'
          onChangeText={(text) => this.setState({description: text})}
          value={this.state.text}/>
      </Item>
    
      
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
  col: {
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center', // this will prevent TFs from stretching horizontal
    marginLeft: 7, marginRight: 7,
    // backgroundColor: MKColor.Lime,
  },
  textfield: {
    height: 28,  // have to do it on iOS
    marginTop: 32,
  },
  textfieldWithFloatingLabel: {
    height: 48,  // have to do it on iOS
    marginTop: 10,
  },
});