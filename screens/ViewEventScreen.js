import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, Linking, ActivityIndicator, ListView, SegmentedControlIOS, Alert} from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import { Toolbar, Button, Card, ListItem, Avatar } from 'react-native-material-ui';
import Moment from 'moment'


export default class ViewEventScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'View Event',
    }
  };

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1.accepted !== r2.accepted});
    const event = JSON.parse(props.route.params.event);
    this.state = {
      event: event,
      users: this.ds.cloneWithRows(event.attending),
      accepted: event.invitation.accepted,
      loaded: false
    };
  }

  componentWillMount() {
    this.updateData();
  }

  updateData() {
    Database.getAttendance(this.state.event.id).then( (attending) => {
      this.setState({
        loaded: true,
        users: this.ds.cloneWithRows(attending)
      });
    }).catch( (error) => {
      console.error(error);
    });
  }

  renderWebView() {
    var url = this.state.event.venmoURL;
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

  renderVenmoPrompt() {
    if (!!this.state.event.venmoURL) {
      const prompt = this.state.event.host.name + ' requested a $' + this.state.event.cost + ' donation to help with the cost of the meal. Do you want to pay via Venmo now?';
      return (Alert.alert(
        'Ready to Pay?',
        prompt,
        [
          {text: 'No'},
          {text: 'Yes', onPress: () => this.renderWebView()}
        ]
      ));
    }
  } 

  handleInviteResponse(val) {
    Database.respondToInvite(this.state.event, val).then((res) => {
      this.setState({accepted: val, loaded: false});
      this.updateData();
      if (!!val) this.renderVenmoPrompt();
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

  renderMenu() {
    var menuItems = [];
    console.log(this.state.event.recipes);
    if (this.state.event.recipes != null) {
      menuItems = this.state.event.recipes.map((recipe) => <ListItem
              leftElement={<Image source={{uri: recipe.photoURL}} style={{width: 40, height: 40, borderRadius: 20}} />}
              centerElement={{
                  primaryText: recipe.title,
              }}
          />);
    }
   console.log(menuItems);
   return menuItems; 

  }

  renderAttending() {
    if (this.state.loaded) {
      return (
        <ListView
          dataSource={this.state.users}
          renderRow={(user) =><ListItem
            leftElement={<Image source={{uri: user.photoURL}} style={{width: 40, height: 40, borderRadius: 20}} />}
            centerElement={{
                primaryText: user.name,
                secondaryText: (!(user.accepted == null)) ? ( (!!user.accepted) ? 'is attending!' : 'not attending :(') : 'not sure if attending' ,
            }}
        />}
      />);
    } else {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            animating={true}
            style={[styles.centering, {height: 80}]}
            size="large"
          />
        </View>
      );
    }
  }

  renderInviteResponse() {
    if (!this.props.route.params.hosting) {
      return (
        <View>
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
          </View>
        </View>
      );
    }
  }

  renderHostingText() {
    if (this.props.route.params.hosting) {
      return (<Text>You are hosting {this.state.event.type}!</Text>);
    } else {
      return (<Text>{this.state.event.host.name} is hosting {this.state.event.type}!</Text>);
    }
  }

  render() {
    const d = new Date(this.state.event.date);
    const m = Moment(this.state.event.date);
    const deleteButton = this.renderDeleteEvent();
    const venmoButton = this.renderVenmoButton();
    const attendingUsers = this.renderAttending();
    const inviteResponse = this.renderInviteResponse();
    const hostingText = this.renderHostingText();
    const menu = this.renderMenu();
    return (
      <ScrollView>
      <Card>
        <ListItem
          leftElement={<Image source={{uri: this.state.event.host.photoURL}} style={{width: 40, height: 40, borderRadius: 20}} />}
          centerElement={{
              primaryText: this.state.event.name,
              secondaryText: m.format("ddd MMM Do h:mm a"),
          }}
        />
        <View style={styles.textContainer}>
          {hostingText}
        </View>
        {inviteResponse}
      </Card>
      <Card >
        <View style={styles.textContainer}>
            <Text>
                Attendees
            </Text>
        </View>
        {attendingUsers}
      </Card>
      <Card>
        <View style={styles.textContainer}>
            <Text>
                Menu
            </Text>
        </View>
        { menu }
      </Card>
      <Card>
        <View style={styles.textContainer}>
            <Text>
                Suggest Donation Amount ${this.state.event.cost}
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
    flex: 1, 
    justifyContent: 'space-between',
    flexDirection: 'row', 
    height: 30,
    paddingBottom: 10,
  }
});

