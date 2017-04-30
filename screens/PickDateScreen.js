import React from 'react';
import { StyleSheet, Text, View, Button, ListView, TouchableOpacity } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";


export default class PickDateScreen extends DefaultScreen {
  static route = {
    navigationBar: {
      title: 'Step One: Availability',
    }
  };

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {logged_in: false, availability: ds.cloneWithRows([])};
    Database.getBestDays().then((availability) => {
      console.log(availability);
      this.setState({availability: ds.cloneWithRows(availability)})
    }).catch((e) => {
      console.log('Could not get availability');
      console.log("Error", e.stack);
      console.log("Error", e.name);
      console.log("Error", e.message);
    });
  }

  onNextTap() {
    console.log("next tapped")
    // //TODO: Update this line with the user's actual availability
    // Database.setUserData(this.state.user.uid, {
    //   // Days of week: 0 = Sunday, 6 = Saturday
    //   availability: [0,1,2,3,4,5,6]
    // });
    // this.props.navigator.push(Router.getRoute('addFriends'));
  }

  onPressRow(rowData, sectionID) {
    console.log('row pressed');
  }

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableOpacity onPress={this.onPressRow}>
          <View>
              <Text>{rowData.day}: {rowData.users.length} people available</Text>        
          </View>
      </TouchableOpacity>
    );
  }

  renderView() {
    return (
      <View
        style={styles.container}
      >

      <ListView
          dataSource={this.state.availability}
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