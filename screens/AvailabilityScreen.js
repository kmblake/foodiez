import React from 'react';
import { StyleSheet, View, TouchableHighlight, Text, AsyncStorage, ScrollView } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import { Container, Content, List, ListItem, CheckBox, Header, Body, Title, Right, Left } from 'native-base';
import MultiSelectListView from "../components/MultiSelectListView";
import { Item, Input, Form, Label } from 'native-base';
import { Button } from 'react-native-material-ui'
import * as firebase from "firebase";
import Expo from 'expo';


export default class AvailabilityScreen extends DefaultScreen {
  
  constructor(props) {
    super(props);
    const availabilityOptions = [
      {
        day: 'Sunday',
        index: 0
      },
      {
        day: 'Monday',
        index: 1
      },
      {
        day: 'Tuesday',
        index: 2
      },
      {
        day: 'Wednesday',
        index: 3
      },
      {
        day: 'Thursday',
        index: 4
      },
      {
        day: 'Friday',
        index: 5
      },
      {
        day: 'Saturday',
        index: 6
      }
    ];
    this.state = {availability: [0,1,2,3,4,5,6], venmo: null, availabilityOptions: availabilityOptions};
    
  }

  static route = {
    navigationBar: {
      title: 'User Settings',
      visible: false
    }
  };

  componentDidMount() {
    this.getUserData();
    firebase.database().ref('users/' + this.props.route.params.user.uid).once('value').then((snapshot) => {
      const user = snapshot.val();
      const venmo = (!!user.venmo) ? user.venmo : null;
      const newOptions = this.state.availabilityOptions.map( (option) => {
        if (user.availability.indexOf(option.index) >= 0) {
          option.checked = true;
        } else {
          option.checked = false;
        }
        return option
      });
      this.setState({
        venmo: venmo,
        availabilityOptions: newOptions
      })
    });
  }

  async logout() {
    await AsyncStorage.removeItem('user_data');
    await firebase.auth().signOut()
    this.props.navigator.push(Router.getRoute('home'));
   }


  onNextTap() {

    //TODO: Update this line with the user's actual availability
    const availArray = this.state.availability.map( (option) => {
      return option.index;
    });
    Expo.Amplitude.logEventWithProperties("Adds availability", {availability: availArray});
    if (this.state.venmo != null) {
      Expo.Amplitude.logEvent("Adds Venmo");
    }
    
    Database.setUserData(this.state.user.uid, {
      // Days of week: 0 = Sunday, 6 = Saturday
      availability: availArray,
      venmo: this.state.venmo
    });
    this.props.navigator.push(Router.getRoute('home'));
  }

 

  renderRowContents(option) {
    return (
      <Text>{option.day}</Text>
    );
  }

  onSelectionChanged(avail) {
    this.state.availability = avail;
  }


  renderView() {
    // const venmoPlaceholder = (!!this.state.venmo) ? this.state.venmo : 'Your Venmo'
    return (
      <ScrollView style={styles.container}>
      <Header>
        <Left>
        </Left>          
        <Body>
            <Title>Settings</Title>
        </Body>
        <Right>
          <Button
          accent
          onPress={() => (this.logout())}
          text="Logout"
        /> 
        </Right>
      </Header>
        <Text style={styles.prompt}>
          Tap to choose the days that you're generally available. Also add your Venmo username to make it easy for friends to pay you back!
        </Text>
        <MultiSelectListView
          dataSource={this.state.availabilityOptions}
          renderRowContents={this.renderRowContents.bind(this)}
          onSelectionChanged={this.onSelectionChanged.bind(this)}
          initialCheckboxState={true}
        />
        <View style={styles.venmoInput}>
        <Item fixedLabel>
          <Label>Your Venmo</Label>
          <Input 
            onChangeText={(text) => this.setState({venmo: text})}
            placeholder={this.state.venmo}
          />
        </Item>
        </View>
        <Button
          primary 
          raised
          onPress={() => (this.onNextTap())}
          text="Save"
        />  
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  venmoInput: {
    paddingTop: 15
  },
  prompt: {
    color: 'rgba(0,0,0,0.4)',
    marginLeft: 15,
    marginTop: 15
  },
  datePicker: {
    paddingTop: '50%',
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between'
  }
});