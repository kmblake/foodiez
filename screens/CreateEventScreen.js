import React from 'react';
import { StyleSheet, Text, TextInput , View, DatePickerIOS, ListView, Dimensions, TouchableOpacity, TouchableHighlight, Image, Keyboard, TouchableWithoutFeedback, Platform, TimePickerAndroid, ScrollView} from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import { Container, Content, Item, Input, Form, Label, Header, CardItem, TabHeading, Right, Left, ScrollableTab, Icon, Body, Title, Tab, Tabs } from 'native-base';
import Carousel from 'react-native-carousel';
import recipeData from "../firebase/recipes.json"
import { Card, Button } from 'react-native-material-ui'
import Moment from 'moment'
import Expo from 'expo'
 
export default class CreateEventScreen extends DefaultScreen {
  static route = {
    navigationBar: {
      title: 'Event Details',
    }
  };

  

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const eventTypes = ['BBQ', 'Tapas Night', 'Picnic', 'Dinner'];
    this.state = {
      logged_in: false, 
      date: new Date(props.route.params.date),
      eventType: 'Dinner',
      eventTypes: eventTypes,
      description: "",
      location: "",
      showDatePicker: false, 
      name: "",
      cost: '5'
    };
  }

  formatEvent() {
    const invitedFriends = this.state.invitedFriends
    const dateString = this.state.date.toString();
    const curUser = {
        name: this.state.user.displayName,
        uid: this.state.user.uid,
        photoURL: this.state.user.photoURL
    };
    var event = {
      type: 'Custom',
      date: this.state.date.getTime(),
      description: this.state.description,
      location: this.state.location,
      host: curUser,
      attending: [curUser],
      cost: this.state.cost,
      name: (!!this.state.name) ? this.state.name : 'Dinner'
    };
    return event;
  }

  

  onNextTap() {
    Expo.Amplitude.logEvent("Skips adding theme")

    var event = this.formatEvent();
    event.type = 'custom'
    this.props.navigator.push(Router.getRoute('confirmEvent', 
      {event: JSON.stringify(event), invitedFriends: this.props.route.params.invitedFriends}));
  }

  onMenuPress(eventType) {
    Expo.Amplitude.logEvent("Pick theme started");
    var event = this.formatEvent();
    event.type = eventType
    this.props.navigator.push(Router.getRoute('pickRecipes', 
      {event: JSON.stringify(event), invitedFriends: this.props.route.params.invitedFriends}));
  }

  async onDatePress() {
    Keyboard.dismiss();
    if (Platform.OS === 'android') {
     const {action, minute, hour} = await TimePickerAndroid.open({hour: this.state.date.getHours(), minute: this.state.date.getMinutes()});
     if (action === TimePickerAndroid.timeSetAction) {
        var date = new Date(this.state.date);
        date.setHours(hour);
        date.setMinutes(minute);
        this.onDateChange(date);
     }
      
    } else {
      this.setState({
        showDatePicker: !this.state.showDatePicker
      })
    }
    
  }

  renderDatePicker() {
    if (this.state.showDatePicker) {
      if (Platform.OS === 'ios') {
        return (
        <DatePickerIOS
           date={this.state.date}
           mode="time"
           onDateChange={this.onDateChange.bind(this)}
         />);
      } 
    } 
  }

  onDateChange(date) {
    this.setState({date: date});
  }

  renderView() {
    const datePicker = this.renderDatePicker();
    return ( 
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
        <Text style={styles.prompt}>Enter the details about your event here, including how much you'd like each guest to contribute to cover the cost!</Text>
        <Form>
          <Item inlineLabel>
            <Input 
              placeholder='Name'
              onChangeText={(text) => this.setState({name: text})}
              value={this.state.name}/>
          </Item>
          <Item inlineLabel>
            <Input 
              placeholder='Description'
              multiline={true}
              onChangeText={(text) => this.setState({description: text})}
              value={this.state.text}/>
          </Item>
          <Item inlineLabel>
            <Input 
              placeholder='Location'
              multiline={true}
              onChangeText={(text) => this.setState({location: text})}
              value={this.state.location}/>
          </Item>

          <Item fixedLabel >
            <Label>Suggested Contribution ($)</Label>
            <Input 
              keyboardType = 'numeric'
              onChangeText={(text) => this.setState({cost: text})}
              value={this.state.cost}/>
          </Item>
          <Item fixedLabel last
            onPress={this.onDatePress.bind(this)}
          >
            <Label>Time</Label>
            <Input disabled
              placeholder='Location'
              onChangeText={(text) => this.setState({location: text})}
              value={Moment(this.state.date).format("ddd MMM Do h:mm a")}/>
          </Item>
        </Form>
        

        {datePicker}

        </ScrollView>

        <View >

        <Button
          primary 
          onPress={() => (this.onNextTap())}
          text="Use my own recipes"
        />
        <Button raised
          primary 
          onPress={() => (this.onMenuPress('tapas'))} //taps bug is here
          text="Choose Recipes"
        /> 
      </View> 
    </View> 
      

      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },

  menuPrompt: {
    textAlign: 'center',
    color: 'rgba(0,0,0,0.4)'
  },
  menuTheme: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  skipMenuButton: {
    fontSize: 10
  },
  carouselContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  carouselRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
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
  recipeImage: {
    height: 250,
    width: 350,
    resizeMode: 'contain'
  },
  eventTypeView: {
    flex: 1,
    flexDirection: 'column'
  },
  prompt: {
    color: 'rgba(0,0,0,0.4)',
    marginLeft: 15
  },
});