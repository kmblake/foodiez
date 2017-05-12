import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Linking, ActivityIndicator, ListView, SegmentedControlIOS, Alert} from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import { Toolbar, Button, Card, ListItem, Avatar } from 'react-native-material-ui';

export default class ViewEventScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'View Event',
    }
  };

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const event = JSON.parse(props.route.params.event);
    this.state = {
      event: event,
      users: this.ds.cloneWithRows(event.attending),
      accepted: event.accepted
    };
  }

  componentWillMount() {
    this.updateData();
  }

  updateData() {
    Database.getAttendance(this.state.event.id).then( (attending) => {
      this.setState({
      users: this.ds.cloneWithRows(attending)
      });
    }).catch( (error) => {
      console.error(error);
    });
  }

  renderWebView() {
    var url = this.state.event.venmoURL;
    console.log
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }

  deleteEvent() {
    Database.deleteEvent(this.state.event.id).then((res) => {
      this.props.navigator.pop();
    });
  }

  deleteEventDialog() {
    return (Alert.alert(
      'Confirm Cancellation',
      'Are you sure you want to cancel this event?',
      [
        {text: 'No', onPress: () => console.log('Cancel Pressed!')},
        {text: 'Yes', onPress: () => this.deleteEvent()}
        
      ]
    ));
    
  }

  renderDeleteEvent() {
    if (this.props.route.params.hosting) {
      return (
        <Button
          raised
          accent
          onPress={this.deleteEventDialog.bind(this)}
          text="Cancel Event"
        />
      );
    }
  }

  getButtonStyle(val) {
    if (this.state.accepted == val) {
      return ({text: styles.selected});
    } 
  }  

  handleInviteResponse(val) {
    Database.respondToInvite(this.state.event, val).then((res) => {
      this.setState({accepted: val});
    }).catch( (error) => {
      console.error(error);
    });
  }

  renderVenmoButton() {
    if (!!this.state.event.venmoURL) {
      return (
        <View style={styles.button}>
            <Button primary text="Pay With Venmo" icon="monetization-on" onPress={() => this.renderWebView()} />
        </View>
      );
    } else {
      return (<Text style={styles.greyText} >{this.state.event.host.name} has not linked their Venmo account.</Text>);
    }
    
  }

  render() {
    const d = new Date(this.state.event.date);
    const deleteButton = this.renderDeleteEvent();
    const venmoButton = this.renderVenmoButton();
    return (
      <ScrollView>
      <Card>
        <ListItem
          leftElement={<Image source={{uri: this.state.event.host.photoURL}} style={{width: 40, height: 40, borderRadius: 20}} />}
          centerElement={{
              primaryText: this.state.event.type,
              secondaryText: d.toString(),
          }}
        />
        <View style={styles.textContainer}>
          <Text>
            {this.state.event.host.name} is hosting {this.state.event.type}!
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text>
            Are you planning to attend?
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button primary style={this.getButtonStyle(true)} text="Yes" icon="thumb-up" onPress={() => {this.handleInviteResponse(true)}} />
          </View>
          <View style={styles.button}>
              <Button accent style={this.getButtonStyle(false)} text="No" icon="thumb-down" onPress={() => {this.handleInviteResponse(false)}} />
          </View>
          <View style={styles.button}>
              <Button secondary style={this.getButtonStyle(undefined)} text="Not Sure" icon="thumbs-up-down"   onPress={() => {this.handleInviteResponse(null)}} />
          </View>
        </View>
        <ListView
          scrollEnabled={false}
          dataSource={this.state.users}
          renderRow={(user) => <Text>{user.name}  {(!!user.accepted) ? 'is attending!' : ''}</Text>}
        />
      </Card>
      <Card >
        <View style={styles.textContainer}>
            <Text>
                Attendees
            </Text>
        </View>
        <ListView
          dataSource={this.state.users}
          renderRow={(user) =><ListItem
            leftElement={<Image source={{uri: user.photoURL}} style={{width: 40, height: 40, borderRadius: 20}} />}
            centerElement={{
                primaryText: user.name,
                secondaryText: (!(user.accepted == null)) ? ( (!!user.accepted) ? 'is attending!' : 'not attending :(') : 'not sure if attending' ,
            }}
        />}
        />
      </Card>
      <Card>
        <View style={styles.textContainer}>
            <Text>
                Suggest Donation Amount $5
            </Text>
        </View>
      
        {venmoButton}

      </Card>
      {deleteButton}
      </ScrollView>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  greyText: {
    color: 'rgba(0,0,0,0.4)',
    marginHorizontal: 2
  },
  textContainer: {
    paddingLeft: 10,
    paddingBottom: 10,
    paddingRight: 10,
  },
  button: {
    marginHorizontal: 2,
  },
  selected: {
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  card: {
    flex: 2,
    flexDirection: 'column'
  },
  buttonContainer: {
    flex: 20, 
    flexDirection: 'row', 
    height: 30,
    paddingBottom: 10,
  }
});