import React from 'react';
import { StyleSheet, View, Button, ListView, TouchableOpacity, Image } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import { Container, Content, Body, ListItem, Text, CheckBox } from 'native-base';
import MultiSelectListView from "../components/MultiSelectListView";

export default class InviteFriendsScreen extends DefaultScreen {
  static route = {
    navigationBar: {
      title: 'Invite Friends',
    }
  };

  constructor(props) {
    super(props);  
    this.state = {
      availableFriends: JSON.parse(props.route.params.availableFriends),
      logged_in: true, 
      date: new Date(props.route.params.date),
      invitedFriends: []
    };
  }

  onNextTap() {
    const dateString = this.state.date.toString();
    this.props.navigator.push(Router.getRoute('createEvent', {date: dateString, invitedFriends: JSON.stringify(this.state.invitedFriends)}));
    console.log('next tapped');
  }

  renderRowContents(user) {
    return (
      <View style={styles.row}>
        <Image style={styles.profileImage} source={{uri: user.photoURL}} />
        <Text style={{paddingLeft: 5}} >{user.name}</Text>
      </View>
    );
  }

  onSelectionChanged(invitedFriends) {
    this.state.invitedFriends = invitedFriends;
  }

  renderView() {
    // Add date picker
    return (
      <View
        style={styles.container}
      >
      <MultiSelectListView
        dataSource={this.state.availableFriends}
        renderRowContents={this.renderRowContents.bind(this)}
        onSelectionChanged={this.onSelectionChanged.bind(this)}
      />
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
  row: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    width: 300,
    alignItems: 'center'
  },
  profileImage: {
    width: 40, 
    height: 40,
    borderRadius: 20
  },
  container: {
    flex: 1,
    paddingTop: 15,
  }
});