import React from 'react';
import { StyleSheet, Text, View, Button, Image, ListView, TouchableOpacity, ActivityIndicator, TouchableHighlight, SegmentedControlIOS } from 'react-native';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import { Avatar, Card, ListItem, Toolbar } from 'react-native-material-ui';
import Moment from 'moment'

export default class EventListItemView extends React.Component {

  render() {
    const d = new Date(this.props.event.date);
    const m = Moment(this.props.event.date);
    return (

      <Card onPress={() => {
            this._viewEvent(this.props.event.id);
          }}>
        <ListItem
            leftElement={<Image source={{uri: this.props.event.host.photoURL}} style={{width: 40, height: 40, borderRadius: 20}} />}
            centerElement={{
                primaryText: this.props.event.type,
                secondaryText: m.format("ddd MMM Do h:mm a"),
            }}
        />
        <View style={styles.textContainer}>
            <Text>
                {this.props.event.host.name} is hosting {this.props.event.type} 
            </Text>
        </View>
      </Card>
    );
  }

  _viewEvent (rowID: number) {
    this.props.navigator.push(Router.getRoute('viewEvent', {event: JSON.stringify(this.props.event)}));
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
  }
});