import React from 'react';
import { StyleSheet, View, TouchableHighlight, Text, AsyncStorage, ScrollView, Share, Image, ActivityIndicator, Platform} from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
// import { Container, Content, List, ListItem, CheckBox, Header, Body, Title, Right, Left } from 'native-base';
import { Button, Card, ListItem, Avatar } from 'react-native-material-ui';
import * as firebase from "firebase";
import Expo from 'expo';
import { EventCard } from '../components/EventCard';


export default class InviteScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'Invite Friends'
    }
  };

  constructor(props) {
    super(props);
    this.state = {friends: [], loaded: false}
  }

  async showCachedFriends() {
    cached_friends = await AsyncStorage.getItem('friends');
    if (!!cached_friends) {
      this.setState({friends: JSON.parse(cached_friends), loaded: true});
    }
  }

  componentDidMount() {
    this.showCachedFriends()
    Database.getFriends().then( (friends) => {
      friends.sort( (a, b) => {
        aArr = a.name.split(' ');
        bArr = b.name.split(' ');
        aLast = aArr[aArr.length - 1];
        bLast = bArr[bArr.length - 1];
        return (aLast.localeCompare(bLast));
      });
      AsyncStorage.setItem('friends', JSON.stringify(friends)).then( () => {
        this.setState({friends: friends, loaded: true})
      })
    }).catch( (err) => {
      console.error(err);
    });
  }

  shareFoodiez() {
    Expo.Amplitude.logEvent("Shares app with friends");
    var message = 'Join me for dinner using a new app called Foodiez! You\'ll need to download an app called Expo first and then open Foodiez using this link:';
    if (Platform.OS === 'android') {
      message = 'Join me for dinner using a new app called Foodiez! You\'ll need to download an app called Expo first and then open Foodiez using this link: https://exp.host/@kmblake/foodiez';
    }
    Share.share({
      message: message,
      url: 'https://exp.host/@kmblake/foodiez',
      title: 'Join me on Foodiez!'
    });
  }

  doneInviting() {
    if (this.props.route.params.onboarding) {
      this.props.navigator.push(Router.getRoute('home'));
    } else {
      this.props.navigator.pop();
    }
  }

  renderFriends() {
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
    }
    var friends = [];
    if (this.state.friends != null && this.state.friends.length > 0) {
        friends = this.state.friends.map((friend) => <ListItem
                key={friend.uid}
                leftElement={<Image source={{uri: friend.photoURL}} style={{width: 40, height: 40, borderRadius: 20}} />}
                centerElement={{
                    primaryText: friend.name,
                }}
            />);
    } else {
      friends = (
        <View style={styles.textContainer}>
          <Text style={styles.prompt}>No other friends using Foodiez yet...invite some more!</Text>
        </View>
      );
    }
   return friends; 

  }

  render() {
    return (
      <View style={{flex: 1}}>
        <ScrollView>
          <View style={styles.textContainer}>
            <Text style={styles.prompt}>If you want to create an event with friends, they'll need Foodiez first!</Text>
            <Button
              primary
              raised
              onPress={this.shareFoodiez}
              text="Share Foodiez App Link"
              style={{container: {marginTop: 5}}}
            />
          </View>
          <View style={styles.textContainerMiddle}>
            <Text style={styles.prompt}>Once your Facebook friends join Foodiez, you'll automatically be able to invite them to events.</Text>
          </View>
          <EventCard title="Friends Using Foodiez">
            {this.renderFriends()}
          </EventCard>
          
        </ScrollView>
        <Button
          primary raised
          onPress={this.doneInviting.bind(this)}
          text="Done Inviting"
        />
        
      </View>
    )

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
  heading: {
    height: 20
  },
  textContainer: {
    padding: 10
  },
  textContainerMiddle: {
    padding: 10,
    paddingTop: 0
  },
  prompt: {
    color: 'rgba(0,0,0,0.4)'
  },
});