import React from 'react';
import { StyleSheet, Text, View, Button, ListView, TouchableOpacity, ActivityIndicator, TouchableHighlight } from 'react-native';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import EventListItemView from "./EventListItemView";


export default class EventListView extends React.Component {

  constructor() {
    super();
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    Database.getEvents().then( (events) => {
      this.setState({
      events: ds.cloneWithRows(events),
      loaded: true
      });
    }).catch( (error) => {
      console.error(error);
    });
    this.state = {
      loaded: false,
      events: ds.cloneWithRows([])
    };
  }

  render() {
    if (!this.state.loaded) {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            animating={true}
            style={[styles.centering, {height: 80}]}
            size="large"
          />
        </View>
      );
    } else {
      return this.renderView();
    }
  }

  _renderRow(event, sectionID, rowID) {
    return (
      <EventListItemView 
        event={event} 
        rowID={rowID} 
      />
    );
  }

  renderView() {
    // Add date picker
    return (
     <ListView
        dataSource={this.state.events}
        // renderRow={(event) => <Text>{event.type} ({event.id}) Host: {event.host.name} </Text>}
        renderRow={this._renderRow.bind(this)}
      />
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