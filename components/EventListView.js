import React from 'react';
import { StyleSheet, Text, View, Button, ListView, TouchableOpacity, ActivityIndicator } from 'react-native';
import Router from '../navigation/Router';
import Database from "../firebase/database";


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

  // onEventsLoaded(events) {
  //   var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
  //   console.log(events);
  //   this.setState({
  //     events: ds.cloneWithRows(events),
  //     loaded: true
  //   });
  // }

  // onEventLoadError(error) {
  // }

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


  renderView() {
    // Add date picker
    return (
     <ListView
        dataSource={this.state.events}
        renderRow={(event) => <Text>{event.type} ({event.id}) Host: {event.host.name} </Text>}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
});