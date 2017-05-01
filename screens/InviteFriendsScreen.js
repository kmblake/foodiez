import React from 'react';
import { StyleSheet, Text, View, Button, ListView, TouchableOpacity } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";


export default class InviteFriendsScreen extends DefaultScreen {
  static route = {
    navigationBar: {
      title: 'Invite Friends',
    }
  };

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      logged_in: false, 
      date: new Date(props.route.params.date),
      availableFriends: ds.cloneWithRows(JSON.parse(props.route.params.availableFriends)),
      invitedFriends: []
    };
  }

  onNextTap() {
    console.log('next tapped');
    // this.props.navigator.push(Router.getRoute('addFriends'));
  }

  onPressRow(rowData, sectionID) {
    console.log('row pressed');
  }

  renderRow(user, sectionID, rowID) {
    return (
      <TouchableOpacity onPress={this.onPressRow}>
          <View>
              <Text>{user.name}</Text>        
          </View>
      </TouchableOpacity>
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