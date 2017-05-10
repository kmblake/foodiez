import React from 'react';
import { StyleSheet, Text, TextInput , View, Button, DatePickerIOS, ListView, TouchableOpacity, TouchableHighlight } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import { Container, Content, Item, Input, Form, Label } from 'native-base';
import Carousel from 'react-native-carousel';

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
      description: "Description",
      location: "Location",
      showDatePicker: false
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
      attending: [curUser]
    };
    return event;
  }

  onNextTap() {
    var event = this.formatEvent();
    event.type = 'custom'
    this.props.navigator.push(Router.getRoute('confirmEvent', 
      {event: JSON.stringify(event), invitedFriends: this.props.route.params.invitedFriends}));
  }

  onMenuPress(eventType) {
    var event = this.formatEvent();
    event.type = eventType
    this.props.navigator.push(Router.getRoute('pickRecipes', 
      {event: JSON.stringify(event), invitedFriends: this.props.route.params.invitedFriends}));
  }

  onDatePress() {
    this.setState({
      showDatePicker: !this.state.showDatePicker
    })
  }

  renderCarousel() {
    return (
      <Carousel width={375}  animate={false}>
        <View style={styles.carouselContainer}>
          <TouchableHighlight onPress={() => this.onMenuPress('tapas')}>
            <Text>Tapas</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.carouselContainer}>
          <Text>Page 2</Text>
        </View>
        <View style={styles.carouselContainer}>
          <Text>Page 3</Text>
        </View>
      </Carousel>
    );
  }

  renderDatePicker() {
    if (this.state.showDatePicker) {
      return (
      <DatePickerIOS
         date={this.state.date}
         mode="time"
         onDateChange={this.onDateChange.bind(this)}
       />);
    } else {
      return null;
    }
  }

  onDateChange(date) {
    this.setState({date: date});
  }

  renderView() {
    const carousel = this.renderCarousel();
    const datePicker = this.renderDatePicker();
    return (  
      <View style={styles.container}>
      <Form>
        <Item regular>
          <Input 
            placeholder='Description'
            onChangeText={(text) => this.setState({description: text})}
            value={this.state.text}/>
        </Item>
        <Item regular>
          <Input 
            placeholder='Location'
            onChangeText={(text) => this.setState({location: text})}
            value={this.state.location}/>
        </Item>
        <Item fixedLabel
          onPress={this.onDatePress.bind(this)}
        >
          <Label>Date</Label>
          <Input disabled
            placeholder='Location'
            onChangeText={(text) => this.setState({location: text})}
            value={this.state.date.toString()}/>
        </Item>
        
      </Form>
       
      {datePicker}
      {carousel}   
      <Button
        onPress={() => (this.onNextTap())}
        title="Create Event"
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
  carouselContainer: {
    width: 375,
    flex: 1,
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
});