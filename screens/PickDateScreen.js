import React from 'react';
import { StyleSheet, Text, View, Button, ListView, TouchableOpacity, DatePickerIOS } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import CalendarPicker from 'react-native-calendar-picker';

export default class PickDateScreen extends DefaultScreen {
  static route = {
    navigationBar: {
      title: 'Pick a Date',
    }
  };

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {logged_in: false, availability: ds.cloneWithRows([]), chosenDate: new Date()};
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
    const dayOfWeek = this.state.chosenDate.getDay();
    const availableFriends = this.state.availability.getRowData(0, dayOfWeek).users;
    const dateString = this.state.chosenDate.toString();
    console.log(dateString);
    this.props.navigator.push(Router.getRoute('inviteFriends', {date: dateString, availableFriends: JSON.stringify(availableFriends)}));
  }

  onPressRow(rowData, sectionID) {
    console.log('row pressed');
  }
  onDateChange = (date) => {
    this.setState({chosenDate: date});
  };

  renderRow(rowData, sectionID, rowID) {
    return (
      <TouchableOpacity onPress={this.onPressRow}>
          <View style={styles.row}>
              <Text>{rowData.day}: {rowData.users.length} people available</Text>        
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
      <CalendarPicker
          onDateChange={this.onDateChange}
        />
      <View style={styles.listHeader}>
        <Text > Friends Tentative availability </Text>
      </View>
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
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6'
  }
});