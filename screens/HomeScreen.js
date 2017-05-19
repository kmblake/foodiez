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
import { Header, TabHeading, Right, Left, Button, ScrollableTab, Icon, Body, Title, Container, Content, Tab, Tabs } from 'native-base';
import Expo from 'expo';
import { MonoText } from '../components/StyledText';
import Database from "../firebase/database";
import Firebase from "../firebase/firebase";
import * as firebase from "firebase";
import Router from '../navigation/Router';
import EventListView from '../components/EventListView';
import { Toolbar, ActionButton, COLOR, ThemeProvider } from 'react-native-material-ui';



export default class HomeScreen extends React.Component {
  static route = {
    navigationBar: {
      visible: false,
      title: "Events",
      backgroundColor: "white",
    },
  };
  //Todo: icons and functions for nav bar buttons

  constructor(props) {
    global.initializing = false;
    super(props);
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
        // Firebase.logIn();
        Firebase.logIn().then( (user) => {
          if (!!user) {
            AsyncStorage.setItem('user_data', JSON.stringify(user)).then( () => {
              self.getUserData();
              self.setState({shouldSync: true});
            });
          }
        });
      } else  {
        this.checkForFirstTime(user_data);
        Expo.Amplitude.setUserId(firebase.auth().currentUser.uid);
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
    user.availablity = [0, 1, 2, 3, 4, 5, 6]
    this.props.navigator.push(Router.getRoute('availability', {user: this.state.user}));
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
 
  createEvent() {
    Expo.Amplitude.logEvent("Event Creation Started");
    this.props.navigator.push(Router.getRoute('pickDate'));
  }

  renderUserSettings() {
    Expo.Amplitude.logEvent("Visits Settings Page");
    this.props.navigator.push(Router.getRoute('availability', {user: this.state.user }))
  }

  renderFullView() {
    return (
      <View style={styles.container}>
        <Header hasTabs >
          <Left>
          </Left>
          <Body>
            <Title>Events</Title>
          </Body>
          <Right>
              <Button transparent>
                  <Icon name='settings' onPress={() => (this.renderUserSettings())}/>
              </Button>
          </Right>
        </Header>
        <Tabs topTabBarActiveBorderColor={{color: COLOR.green500}} tabStyle={styles.tabStyle} >
          <Tab heading={ <TabHeading><Icon name="home" /><Text>  Hosting</Text></TabHeading>}>
            <EventListView
              hosting={true} 
              shouldSync={this.state.shouldSync}
              navigator={this.props.navigator}/>
          </Tab>
          <Tab heading={ <TabHeading><Icon name="mail" /><Text>  Invites</Text></TabHeading>}>
            <EventListView
              hosting={false} 
              shouldSync={this.state.shouldSync}
              navigator={this.props.navigator}/>
          </Tab>
        </Tabs>
        <ActionButton style={{ container: { backgroundColor: COLOR.green500 }}}
          actions={[]}
          icon="add"
          onPress={() => (this.createEvent())}
        />  
      </View>
    );
  }

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
  tabStyle: {
    backgroundColor: COLOR.green500
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
