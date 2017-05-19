import React from 'react';
import { StyleSheet, Text, View, Image, ListView, TouchableOpacity, DatePickerAndroid, Platform, Share } from 'react-native';
import { Form, Label, Item, Input} from 'native-base';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import CalendarPicker from 'react-native-calendar-picker';
import MultiSelectListView from "../components/MultiSelectListView";
import { Button } from 'react-native-material-ui'
import Expo from 'expo';
import Moment from 'moment';

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
      invitedFriends: [],
      showNextButton: false,
      friendsLoaded: false
    }; 
  }

  componentDidMount() {
    Database.getBestDays().then((availability) => {
      this.setState({availability: availability, availableFriends: availability[this.state.chosenDate.getDay()].users});
    }).catch((e) => {
      console.error(e);
    });
  }

  onNextTap() {
    const dayOfWeek = this.state.chosenDate.getDay();
    const dateString = this.state.chosenDate.toString();
    Expo.Amplitude.logEventWithProperties("Completes inviting friends", {numInvitees: this.state.invitedFriends.length , dayOfWeek: dayOfWeek });
    this.props.navigator.push(Router.getRoute('createEvent', {date: dateString, invitedFriends: JSON.stringify(this.state.invitedFriends)}));
  }

  onDateChange = (date) => {
    // Set event to 6 pm by default
    Expo.Amplitude.logEvent("Selects Calendar Date");
    date.setHours(18);
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
    if (this.state.invitedFriends.length != invitedFriends.length) {
      this.setState({
        invitedFriends: invitedFriends
      });
    }
  }

  renderNextButton() {
    if(this.state.invitedFriends.length > 0) {
      return (
        <Button
          primary
          raised
          onPress={() => (this.onNextTap())}
          text="Craft Your Menu"
        />
      );
    }
  }

  async onDatePress() {
    if (Platform.OS === 'android') {
     const {action, year, month, day} = await DatePickerAndroid.open({date: this.state.chosenDate});
     if (action === DatePickerAndroid.dateSetAction) {
      var date = new Date(year, month, day);
      this.onDateChange(date);
     }
      
    } 
  }

  shareFoodiez() {
    Share.share({
      message: 'Join me for dinner using a new app called Foodiez! You\'ll need to download an app called Expo first and then open Foodiez using this link:',
      url: 'https://exp.host/@kmblake/foodiez',
      title: 'Join me on Foodiez!'
    });
  }

  renderCalendarPicker() {
    if (Platform.OS === 'ios') {
      return (
         <CalendarPicker
          onDateChange={this.onDateChange}
        />
      );
    } else {
      return (
        <Form>
          <Item fixedLabel last
            onPress={this.onDatePress.bind(this)}
          >
            <Label>Date (tap to change)</Label>
            <Input disabled
              value={Moment(this.state.chosenDate).format("ddd MMM Do")}/>
          </Item>
        </Form>
      );
    }
  }

  renderAvailableFriends() {
    if (this.state.availableFriends.length > 0) {
      return (
        <MultiSelectListView
          dataSource={this.state.availableFriends}
          renderRowContents={this.renderRowContents.bind(this)}
          onSelectionChanged={this.onSelectionChanged.bind(this)}
        />
      );
    } else {
      return (<Text style={styles.prompt} >No one is available on that day.</Text>);
    }
  }

  renderView() {
    const nextButton = this.renderNextButton();
    const calendar = this.renderCalendarPicker();
    const prompt = 'Tap to invite friends available on '+ Moment(this.state.chosenDate).format("MMM Do") + '.';
    return (
      <View style={styles.container} >
        {calendar}
     
      <View style={styles.listHeader}>
        <Text style={styles.prompt} > {prompt} </Text>
        <Button
          primary
          onPress={this.shareFoodiez}
          text="Invite more friends to Foodiez"
        />
      </View>
      {this.renderAvailableFriends()}
      {nextButton}
      

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15
  },
  prompt: {
    textAlign: 'center',
    color: 'rgba(0,0,0,0.4)'
  },
  listHeader: {
    flexDirection: 'column',
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