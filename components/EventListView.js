import React from 'react';
import { StyleSheet, Text, View, Button, ListView, TouchableOpacity, ActivityIndicator, TouchableHighlight, RefreshControl } from 'react-native';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import EventListItemView from "./EventListItemView";
import * as firebase from "firebase";

export default class EventListView extends React.Component {

  constructor() {
    super();
    // this.updateData();
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      loaded: false,
      events: this.ds.cloneWithRows([])
    };
  }

  componentWillMount() {
    this.updateData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps != this.props) {
      this.updateData();
    }
  }

  filterEvents(events) {
    return this.props.hosting ? events.filter((event) => event.host.uid == firebase.auth().currentUser.uid) : events.filter((event) => event.host.uid != firebase.auth().currentUser.uid)
  }

  updateData() {
    this.setState({loaded: false});
    Database.getEvents().then( (events) => {

      filteredEvents = this.filterEvents(events);
      this.setState({
      events: this.ds.cloneWithRows(filteredEvents),
      loaded: true
      });
    }).catch( (error) => {
      console.error(error);
    });
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
        hosting={this.props.hosting}
        style={styles.row} 
        event={event} 
        rowID={rowID}
        navigator={this.props.navigator} 
      />
    );
  }

  renderView() {
    // Add date picker
    return (
    <View>
       <ListView
          dataSource={this.state.events}
          // renderRow={(event) => <Text>{event.type} ({event.id}) Host: {event.host.name} </Text>}
          renderRow={this._renderRow.bind(this)}
          enableEmptySections={true}
          refreshControl={
            <RefreshControl
              refreshing={!this.state.loaded}
              onRefresh={this.updateData.bind(this)}
            />
          }
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