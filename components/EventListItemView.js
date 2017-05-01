import React from 'react';
import { StyleSheet, Text, View, Button, ListView, TouchableOpacity, ActivityIndicator, TouchableHighlight, SegmentedControlIOS } from 'react-native';
import Router from '../navigation/Router';
import Database from "../firebase/database";


export default class EventListItemView extends React.Component {

  render() {
    const inviteResponseSelector = this.renderAttending();
    return (
      <View>
        <TouchableHighlight onPress={() => {
            this._viewEvent(this.props.event.id);
          }}>
          <View>
            <View style={styles.row}>
              <Text style={styles.text}>
                {this.props.event.type} ({this.props.event.id}) Host: {this.props.event.host.name}
              </Text>
            </View>
          </View>
        </TouchableHighlight>
        {inviteResponseSelector}
      </View>
    );
  }

  _viewEvent (rowID: number) {
    console.log(rowID);
  }

  _onInviteResponseChange(event) {
    const newIndex = event.nativeEvent.selectedSegmentIndex;
    const selectorIndexToAccepted = [true, false, null];
    console.log("New invite status");
    console.log(selectorIndexToAccepted[newIndex]);
    Database.respondToInvite(this.props.event.invitation.id, selectorIndexToAccepted[newIndex]);

  }

  renderAttending() {
    const acceptedToSelectorIndex = {true: 0, false: 1, undefined: 2};
    const values = ['Yes!', 'No', 'Not Sure'];
    const value = 'Not selected';
    const selectedIndex = acceptedToSelectorIndex[this.props.event.invitation.accepted];
    console.log("selected index")
    console.log(selectedIndex);
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
  text: {
    flex: 1,
  }
});