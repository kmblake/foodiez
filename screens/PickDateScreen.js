import React from 'react';
import { StyleSheet, Text, View, Image, Button, ListView, TouchableOpacity, DatePickerIOS } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import CalendarPicker from 'react-native-calendar-picker';
import MultiSelectListView from "../components/MultiSelectListView";

export default class PickDateScreen extends DefaultScreen {
  static route = {
    navigationBar: {
      title: 'Pick a Date',
    }

  };

  constructor(props) {
    super(props);

    this.state = {
      logged_in: true,
      chosenDate: new Date(),
      availability: [],
      availableFriends: [],
      invitedFriends: []
    }; 
  }

  componentDidMount() {
    Database.getBestDays().then((availability) => {
      this.setState({availability: availability, availableFriends: availability[this.state.chosenDate.getDay()].users});
    }).catch((e) => {
      console.log('Could not get availability');
      console.log("Error", e.stack);
      console.log("Error", e.name);
      console.log("Error", e.message);
    });
  }

  onNextTap() {
    const dayOfWeek = this.state.chosenDate.getDay();
    const dateString = this.state.chosenDate.toString();
    this.props.navigator.push(Router.getRoute('createEvent', {date: dateString, invitedFriends: JSON.stringify(this.state.invitedFriends)}));
  }

  onDateChange = (date) => {
    this.setState({chosenDate: date, availableFriends: availability[date.getDay()].users});

  };

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
  container: {
    flex: 1,
    paddingTop: 15,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10
  },
  profileImage: {
    width: 40, 
    height: 40,
    borderRadius: 20
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    width: 300,
    alignItems: 'center'
  }
});