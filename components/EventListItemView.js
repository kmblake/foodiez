import React from 'react';
import { StyleSheet, Text, View, Button, ListView, TouchableOpacity, ActivityIndicator, TouchableHighlight, SegmentedControlIOS } from 'react-native';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import {
  getTheme
} from 'react-native-material-kit';

const theme = getTheme();

export default class EventListItemView extends React.Component {

  render() {
    const inviteResponseSelector = this.renderAttending();
    const d = new Date(this.props.event.date);
   
    return (

      <View style={theme.cardStyle}>
        <TouchableHighlight onPress={() => {
            this._viewEvent(this.props.event.id);
          }}>
            <View style={theme.cardStyle}>
              <Text style={theme.cardContentStyle}>
                {this.props.event.host.name} is hosting {this.props.event.type} on {d.toString()}
              </Text>
              <Text style={theme.cardContentStyle}>
                Will you be attending?
              </Text>
              <View style={styles.response}>
                {inviteResponseSelector}
              </View>
            </View>
        </TouchableHighlight>
      </View>
    );
  }

  _viewEvent (rowID: number) {
    this.props.navigator.push(Router.getRoute('viewEvent', {event: JSON.stringify(this.props.event)}));
  }

  _onInviteResponseChange(event) {
    const newIndex = event.nativeEvent.selectedSegmentIndex;
    const selectorIndexToAccepted = [true, false, null];
    console.log("New invite status");
    console.log(selectorIndexToAccepted[newIndex]);
    Database.respondToInvite(this.props.event, selectorIndexToAccepted[newIndex]);

  }

  renderAttending() {
    const acceptedToSelectorIndex = {true: 0, false: 1, undefined: 2};
    const values = ['Yes!', 'No', 'Not Sure'];
    const value = 'Not selected';
    const selectedIndex = acceptedToSelectorIndex[this.props.event.invitation.accepted];
    return (
      <SegmentedControlIOS
        values={values}
        selectedIndex={selectedIndex}
        onChange={this._onInviteResponseChange.bind(this)} />
    );
  } 
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
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
  }
});