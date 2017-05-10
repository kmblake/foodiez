import React from 'react';
import { StyleSheet, View, Button, TouchableHighlight } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import {
  MKCheckbox,
} from 'react-native-material-kit';
import { Container, Content, List, ListItem, Text, CheckBox } from 'native-base';
import MultiSelectListView from "../components/MultiSelectListView";
import { Item, Input, Form, Label } from 'native-base';


export default class AvailabilityScreen extends DefaultScreen {
  
  constructor(props) {
    super(props);
    this.availabilityOptions = [
      {
        day: 'Sunday',
        index: 0
      },
      {
        day: 'Monday',
        index: 1
      },
      {
        day: 'Tuesday',
        index: 2
      },
      {
        day: 'Wednesday',
        index: 3
      },
      {
        day: 'Thursday',
        index: 4
      },
      {
        day: 'Friday',
        index: 5
      },
      {
        day: 'Saturday',
        index: 6
      }
    ];
    this.state = {availability: [], venmo: null};
  }

  static route = {
    navigationBar: {
      title: 'Step One: Availability',
    }
  };


  onNextTap() {
    //TODO: Update this line with the user's actual availability
    const availArray = this.state.availability.map( (option) => {
      return option.index;
    });
    Database.setUserData(this.state.user.uid, {
      // Days of week: 0 = Sunday, 6 = Saturday
      availability: availArray,
      venmo: this.state.venmo
    });
    this.props.navigator.push(Router.getRoute('home'));
  }

  // toggleAvailability(day) {
  //   index = this.state.availability.indexOf(day);
  //   if (index > 0)
  //     this.state.availability.splice(1, index);
  //   else
  //     this.state.availability.push(day);
  // }

  renderRowContents(option) {
    return (
      <Text>{option.day}</Text>
    );
  }

  onSelectionChanged(avail) {
    this.state.availability = avail;
  }


  renderView() {
    return (
      <View style={styles.container}>
        <MultiSelectListView
          dataSource={this.availabilityOptions}
          renderRowContents={this.renderRowContents.bind(this)}
          onSelectionChanged={this.onSelectionChanged.bind(this)}
          initialCheckboxState={true}
        />
        <Item fixedLabel>
          <Label>Your Venmo</Label>
          <Input 
            onChangeText={(text) => this.setState({venmo: text})}
          />
        </Item>
        <View style={styles.container} >
          <Button
            onPress={() => (this.onNextTap())}
            title="Next"
            color="#841584"
          />
        </View>
      </View>
    );


    // return (
    //   <View style={styles.container}>
    //     <View style={styles.datePicker}>
    //       <Button
    //         onPress={() => (this.toggleAvailability(0))}
    //         title="Su"
    //         color="#841584"
    //       />
    //       <Button
    //         onPress={() => (this.toggleAvailability(1))}
    //         title="M"
    //         color="#841584"
    //       />
    //       <Button
    //         onPress={() => (this.toggleAvailability(2))}
    //         title="Tu"
    //         color="#841584"
    //       />
    //       <Button
    //         onPress={() => (this.toggleAvailability(3))}
    //         title="W"
    //         color="#841584"
    //       />
    //       <Button
    //         onPress={() => (this.toggleAvailability(4))}
    //         title="Th"
    //         color="#841584"
    //       />
    //       <Button
    //         onPress={() => (this.toggleAvailability(5))}
    //         title="F"
    //         color="#841584"
    //       />
    //       <Button
    //         onPress={() => (this.toggleAvailability(6))}
    //         title="S"
    //         color="#841584"
    //       />
    //     </View>
    //     <View style={styles.container} >
    //       <Button
    //         onPress={() => (this.onNextTap())}
    //         title="Next"
    //         color="#841584"
    //       />
    //     </View>
    //   </View>
    // );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  datePicker: {
    paddingTop: '50%',
    flex: 1, 
    flexDirection: 'row', 
    justifyContent: 'space-between'
  }
});