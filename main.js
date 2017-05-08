import Expo from 'expo';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage, Text } from 'react-native';
import { NavigationProvider, StackNavigation } from '@expo/ex-navigation';
import { FontAwesome } from '@expo/vector-icons';

import Router from './navigation/Router';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';
import Firebase from './firebase/firebase';
import * as firebase from "firebase";
import Database from './firebase/database'

class AppContainer extends React.Component {
  state = {
    appIsReady: false,
    userLoaded: false
  };

  componentWillMount() {
    global.initializing = true;
    this._loadAssetsAsync();
    Firebase.initialize();
    firebase.auth().onAuthStateChanged((user) => {
      if (user != null) {
        console.log("We are authenticated now!");
        try {
          AsyncStorage.setItem('user_data', JSON.stringify(user))
        } catch (error) {
          console.error(error);
        }
        this.setState({userLoaded: true});
      } else {
        try {
          AsyncStorage.removeItem('user_data');
        } catch (error) {
          console.log(error.message);
        }
        if (global.initializing)
          Firebase.logIn();
      }
      
    });
  }

  async _loadAssetsAsync() {
    try {
      await cacheAssetsAsync({
        images: [require('./assets/images/expo-wordmark.png')],
        fonts: [
          FontAwesome.font,
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf') },
        ],
      });
    } catch (e) {
      console.warn(
        'There was an error caching assets (see: main.js), perhaps due to a ' +
          'network timeout, so we skipped caching. Reload the app to try again.'
      );
      console.log(e.message);
    } finally {
      this.setState({ appIsReady: true });
    }
  }

  render() {
    if (this.state.appIsReady) {
      if (this.state.userLoaded) {
        return (
          <View style={styles.container}>
            <NavigationProvider router={Router}>
              <StackNavigation
                id="root"
                initialRoute={Router.getRoute('rootNavigation')}
              />
            </NavigationProvider>

            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            {Platform.OS === 'android' &&
              <View style={styles.statusBarUnderlay} />}
          </View>
        );
      } 
    } 
    return <Expo.AppLoading />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
});

Expo.registerRootComponent(AppContainer);
