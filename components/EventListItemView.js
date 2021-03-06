import React from 'react';
import { StyleSheet, Text, View, Button, Image, ListView, TouchableOpacity, ActivityIndicator, TouchableHighlight, SegmentedControlIOS } from 'react-native';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import { Avatar, Card, ListItem, Toolbar } from 'react-native-material-ui';
import Moment from 'moment'
import Expo from 'expo'

export default class EventListItemView extends React.Component {

  render() {
    const d = new Date(this.props.event.date);
    const m = Moment(this.props.event.date);
    // const hostingInfo = this.renderHostingInfo();
    const name = !!this.props.event.name ? this.props.event.name : 'Dinner';
    return (

      <Card onPress={() => {
            this._viewEvent(this.props.event.id);
          }}>
        <ListItem
            leftElement={<Image source={{uri: this.props.event.host.photoURL}} style={{width: 40, height: 40, borderRadius: 20}} />}
            centerElement={{
                primaryText: name,
                secondaryText: m.format("ddd MMM Do h:mm a"),
            }}
        />
        {this.renderAccepted()}
      </Card>
    );
  }

  _viewEvent (rowID: number) {
    Expo.Amplitude.logEvent("Views an event");
    this.props.navigator.push(Router.getRoute('viewEvent', {event: JSON.stringify(this.props.event), hosting: this.props.hosting}));
  }

  renderHostingInfo() {
    if(!this.props.hosting) {
      return (
        <View style={styles.textContainer}>
            <Text>
                {this.props.event.host.name} is hosting
            </Text>
        </View>
      );
    } 
  }

  renderAccepted() {
    if(!this.props.hosting) {
      if (!!this.props.event.invitation.accepted) {
        return (
          <View style={styles.textContainer}>
            <Text>You're going!</Text>
          </View>
        );
      } else if (this.props.event.invitation.accepted == false) {
        return (
          <View style={styles.textContainer}>
            <Text>You're not going</Text>
          </View>
        );
      } else {
        return (
          <View style={styles.textContainer}>
            <Text style={styles.actionRequired}>Let {this.props.event.host.name} know if you're going!</Text>
          </View>
        );
      }
    }
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  textContainer: {
    paddingLeft: 10,
    paddingBottom: 10,
    paddingRight: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#F6F6F6',
  },
  thumb: {
    width: 64,
    height: 64,
  },
  response: {
    paddingBottom: 10,
  },
  text: {
    flex: 1,
  },
  actionRequired: {
    fontWeight: 'bold'
  }
});