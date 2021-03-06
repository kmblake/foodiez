import React from 'react';
import { StyleSheet, Text, TextInput, ScrollView , Image , View, ListView, ActivityIndicator, TouchableOpacity, TouchableHighlight, DatePickerIOS } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import { Container, Content, Item, Input, Label } from 'native-base';
import { Toolbar, Button, Card, ListItem, Avatar } from 'react-native-material-ui';
import Expo from 'expo';
import Moment from 'moment'
import { EventCard } from '../components/EventCard';


export default class CreateEventScreen extends DefaultScreen {
  static route = {
    navigationBar: {
      title: 'Confirm Event Details',
    }
  };

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const event = JSON.parse(props.route.params.event);  
    const invitedFriends = JSON.parse(props.route.params.invitedFriends);  
   
    this.state = {
      logged_in: true, 
      event: event,
      invitedFriends: invitedFriends,
      invited: this.ds.cloneWithRows(invitedFriends),
      loaded: true,
    };
  }
  isFieldFilled(field) {
    return field == "" ? "no" : "yes";
  }

  changesVenmoAmount(cost) {
    return cost == 5 ? "no" : "yes";
  }
  onNextTap() {
    Expo.Amplitude.logEventWithProperties("Finished event creation",
      {includesName: this.isFieldFilled(this.state.event.name), 
       includesDescription: this.isFieldFilled(this.state.event.description), 
       includesLocation: this.isFieldFilled(this.state.event.location),
       changesVenmoAmount: this.changesVenmoAmount(this.state.cost) 
      });
    
    Database.createEvent(this.state.event, this.state.invitedFriends);
    this.props.navigator.popToTop();
  }


  renderMenu() {
    var menuItems = [];
    if (this.state.event.recipes != null && this.state.event.recipes.length > 0) {
        menuItems = this.state.event.recipes.map((recipe) => <ListItem
                key={recipe.title}
                leftElement={<Image source={{uri: recipe.photoURL}} style={{width: 40, height: 40, borderRadius: 20}} />}
                centerElement={{
                    primaryText: recipe.title,
                }}
            />);
    } else {
      menuItems = (
        <View style={styles.textContainer}>
          <Text>It's a surprise 😉</Text>
        </View>
      );
    }
   return menuItems; 

  }

  renderAttending() {
    if (this.state.loaded) {
      return (
        <ListView
          dataSource={this.state.invited}
          renderRow={(user) =><ListItem
            leftElement={<Image source={{uri: user.photoURL}} style={{width: 40, height: 40, borderRadius: 20}} />}
            centerElement={{
                primaryText: user.name,
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


  renderHostingText() {
    return (<Text>You are hosting {this.state.event.type}!</Text>);
  }

  renderPaymentText() {
    if (!!this.state.event.cost && parseInt(this.state.event.cost) > 0) {
        return (<Text>${this.state.event.cost} per guest </Text>);
      } else {
        return (<Text>None</Text>);
      }
  }

  renderDetails(title, attribute) {
    if (!!attribute) {
      return (
        <View style={{paddingBottom: 10}}>
          <Text style={styles.detailsHeader}>{title}</Text>
          <Text>{attribute}</Text>
        </View>
      );
    }
  }

  renderView() {
    const d = new Date(this.state.event.date);
    const m = Moment(this.props.event.date);
    const attendingUsers = this.renderAttending();
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
        <View style={styles.responseContainer}>
          {this.renderDetails('Host', this.state.event.host.name)}
          {this.renderDetails('Location', this.state.event.location)}
          {this.renderDetails('More Info', this.state.event.description)}
        </View>
        
      </Card>

      <EventCard title="Invited Friends">
        {attendingUsers}
      </EventCard>
      <EventCard title="Menu">
        {menu}
      </EventCard>
      <EventCard title="Suggested Contribution">
        <View style={styles.textContainer}>
          {this.renderPaymentText()}
        </View>
      </EventCard>

        <Button
        raised
        primary
        onPress={() => (this.onNextTap())}
        text="Create Event"
        />
   
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
  },
  responseContainer: {
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  detailsHeader: {
    fontWeight: 'bold',
    paddingBottom: 5
  }
});

