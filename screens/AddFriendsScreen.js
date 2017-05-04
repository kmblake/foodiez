import React from 'react';
import { StyleSheet, Text, View, Button, ListView } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import * as firebase from "firebase";

export default class AddFriendsScreen extends DefaultScreen {
  static route = {
    navigationBar: {
      title: 'Step Two: Add Friends',
    },
  };

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {logged_in: false, users: ds.cloneWithRows([])};
    firebase.database().ref('/users').once('value').then((snapshot) => {
      userData = snapshot.val();
      this.setState({users: ds.cloneWithRows(this.userDataToArray(userData))});
    });
  }

  userDataToArray(userData) {
    console.log(userData);
    users = [];
    for (const id in userData) {
      if (id != this.state.user.uid) {
        var user = userData[id];
        users.push({
          uid: id,
          name: user.name,
          photoURL: user.photoURL
        });
      }
    }
    return users;
  }

  onNextTap() {
    this.props.navigator.push(Router.getRoute('home'));
  }

  renderView() {
    return (
      <View>
        <ListView
          dataSource={this.state.users}
          renderRow={(user) => <Text>{user.name} ({user.uid})</Text>}
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