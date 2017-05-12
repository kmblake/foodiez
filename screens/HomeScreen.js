import React from 'react';
import {
  Image,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  AsyncStorage,
  ActivityIndicator,
  NavigatorIOS,
  SegmentedControlIOS
} from 'react-native';

import Expo from 'expo';

import { MonoText } from '../components/StyledText';

import Database from "../firebase/database";
import Firebase from "../firebase/firebase";
import * as firebase from "firebase";
import Router from '../navigation/Router';
import EventListView from '../components/EventListView';
import { Toolbar, Button, ActionButton } from 'react-native-material-ui';


export default class HomeScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: true,
      title: "Events",
    },
  };
  //Todo: icons and functions for nav bar buttons

  constructor(props) {
    global.initializing = false;
    super(props);
    const self = this;
    this.state = {logged_in: false, shouldSync: false, selectedIndex: 0};
  }

  componentWillMount() {
    this.getUserData();
  }

  getUserData() {
    var self = this;
    AsyncStorage.getItem('user_data').then((user_data_json) => {
      let user_data = JSON.parse(user_data_json);
      if (user_data === null) {
        Firebase.logIn();
      } else  {
        this.checkForFirstTime(user_data);
        this.setState({
          user: user_data,
          logged_in: true
        });
      }
    }).catch( (error) => {
      console.error(error)
    });
  }

  // Setup what to do with the user information.
  userFirstTimeCallback(user, exists) {
    if (!exists) {
      Database.setUserData(user.uid, {
        name: user.displayName,
        photoURL: user.photoURL,
        email: user.email,
        availability: [0, 1, 2, 3, 4, 5, 6]
      })
    this.props.navigator.push(Router.getRoute('availability'));
    }
  }

  checkForFirstTime(user) {
    firebase.database().ref('users/' + user.uid).once('value').then((snapshot) => {
      var exists = (!!snapshot.val() && !!snapshot.val().name);
      this.userFirstTimeCallback(user, exists);
    });
  }

  logout() {
    var self = this;
    firebase.auth().signOut().then(function() {
      console.log('User logged out');
      
      AsyncStorage.removeItem('user_data');
      // this.setState({logged_in: false});
      Firebase.logIn().then( (user) => {
        if (!!user) {
          AsyncStorage.setItem('user_data', JSON.stringify(user)).then( () => {
            self.getUserData();
            self.setState({shouldSync: true});
          });
          
        }
      });
    }).catch(function(error) {
      console.log(error);
    });

   }

  onSelectionChange(event) {
    this.setState({
      selectedIndex: event.nativeEvent.selectedSegmentIndex,
    });
  };


  // renderEventList() {
  //   if (this.state.selectedIndex == 0) {

  //   } else {

  //   }
  // }
 

  renderFullView() {

    return (
      <View style={styles.container}>
        <SegmentedControlIOS
          values={['Invited', 'Hosting']}
          selectedIndex={this.state.selectedIndex}
          onChange={this.onSelectionChange.bind(this)} />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}>
          <EventListView
            hosting={this.state.selectedIndex == 1} 
            shouldSync={this.state.shouldSync}
            navigator={this.props.navigator}/>
        </ScrollView>    
        <Button
          raised
          primary
          onPress={() => (this.props.navigator.push(Router.getRoute('pickDate')))}
          text="New Event"
        />
        <Button
          raised 
          primary
          onPress={() => (this.logout())}
          text="Logout"
          
        />
      </View>
    );
  }
   // <ActionButton
   //        actions={[{ icon: 'sms', label: 'Create Event'}, { icon: 'favorite', label: 'logout'}]}
   //        icon="share"
   //        transition="speedDial"
   //      />

  render() {
    if (!this.state.logged_in) {
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
      return this.renderFullView();
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  helloText: {
    color: 'rgba(0,0,0,0.4)'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 15,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 0,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 140,
    height: 38,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 23,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
