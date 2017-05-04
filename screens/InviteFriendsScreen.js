import React from 'react';
import { StyleSheet, View, Button, ListView, TouchableOpacity } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import { Container, Content, Body, ListItem, Text, CheckBox } from 'native-base';

export default class InviteFriendsScreen extends DefaultScreen {
  static route = {
    navigationBar: {
      title: 'Invite Friends',
    }
  };

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => (r1 !== r2) });
    const availableFriends = JSON.parse(props.route.params.availableFriends);   
    console.log(availableFriends.length);
    this.availableFriendsWithCheck = availableFriends.map((user) => {
      user.checked = false;
      return user;
    });
    // var attendingArray = new Array(availableFriends.length).fill(false);
   
    this.state = {
      logged_in: false, 
      date: new Date(props.route.params.date),
      availableFriends: this.ds.cloneWithRows(this.availableFriendsWithCheck ),
      invitedFriends: []
    };
 

  }


  onNextTap() {
    this.state.invitedFriends.push(this.state.availableFriends.getRowData(0,0));
    this.state.invitedFriends.push(this.state.availableFriends.getRowData(0,1));
    const dateString = this.state.date.toString();
    this.props.navigator.push(Router.getRoute('createEvent', {date: dateString, invitedFriends: JSON.stringify(this.state.invitedFriends)}));
    console.log('next tapped');
    // this.props.navigator.push(Router.getRoute('addFriends'));
  }

  onPressRow(rowID) {
    this.availableFriendsWithCheck[rowID].checked = !this.availableFriendsWithCheck[rowID].checked;
    this.setState({availableFriends: this.ds.cloneWithRows(this.availableFriendsWithCheck )});

    // this.state.attendingArray[rowID] = !this.state.attendingArray[rowID];
    // this.setState({attendingArray: this.state.attendingArray});
    // console.log(this.state.attendingArray);
  }

  renderRow(user, sectionID, rowID) {
    return (
      <ListItem onPress={() => (this.onPressRow(rowID))}>
          <Body>
              <Text>{user.name}</Text>
          </Body>
          <CheckBox checked={user.checked} />
      </ListItem>
    );
  }

  renderView() {
    // Add date picker
    return (
      <View
        style={styles.container}
      >
      <ListView
          dataSource={this.state.availableFriends}
          renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
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
  container: {
    flex: 1,
    paddingTop: 15,
  },
});