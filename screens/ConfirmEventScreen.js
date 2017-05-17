import React from 'react';
import { StyleSheet, Text, TextInput, ScrollView , Image , View, ListView, ActivityIndicator, TouchableOpacity, TouchableHighlight, DatePickerIOS } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import { Container, Content, Item, Input, Label } from 'native-base';
import { Toolbar, Button, Card, ListItem, Avatar } from 'react-native-material-ui';
import Moment from 'moment'


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
      cost: '5',
      loaded: true,
    };
  }

  onNextTap() {
    this.state.event.cost = this.state.cost
    Database.createEvent(this.state.event, this.state.invitedFriends);
    this.props.navigator.popToTop();
  }


  renderMenu() {
    var menuItems = [];
    console.log(this.state.event.recipes);
    if (this.state.event.recipes != null) {
      menuItems = this.state.event.recipes.map((recipe) => 
            <ListItem 
              key={recipe.photoURL}
              leftElement={<Image source={{uri: recipe.photoURL}} 
              style={{width: 40, height: 40, borderRadius: 20}} />}
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

  renderView() {
    const d = new Date(this.state.event.date);
    const m = Moment(this.props.event.date);
    const attendingUsers = this.renderAttending();
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
      </Card>
      <Card >
        <View style={styles.textContainer}>
            <Text>
                Invited Friends
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
            
            <Item stackedLabel>
              <Label>Suggested Donation Amount </Label>
              <Input 
                onChangeText={(text) => this.setState({cost: text})}
                value={this.state.cost}
                keyboardType={'number-pad'}
                />
            </Item>
        </View>

      </Card>

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
  }
});

