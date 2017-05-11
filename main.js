import Expo from 'expo';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage, Text } from 'react-native';
import { NavigationProvider, StackNavigation } from '@expo/ex-navigation';
import { FontAwesome } from '@expo/vector-icons';

import Router from './navigation/Router';
import cacheAssetsAsync from './utilities/cacheAssetsAsync';
import Firebase from './firebase/firebase';
import * as firebase from "firebase";
import { COLOR, ThemeProvider } from 'react-native-material-ui';

const uiTheme = {
    palette: {
        primaryColor: COLOR.green500,
    },
    toolbar: {
        container: {
            height: 50,
        },
    },
  };

class AppContainer extends React.Component {

  

  state = {
    appIsReady: false,
    userLoaded: false
  };

  componentWillMount() {
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
        this.logIn();
      }
      
    });
  }


  async _loadAssetsAsync() {
    try {
      await Font.loadAsync({
        'Rubik-Black': require('./node_modules/@shoutem/ui/fonts/Rubik-Black.ttf'),
        'Rubik-BlackItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-BlackItalic.ttf'),
        'Rubik-Bold': require('./node_modules/@shoutem/ui/fonts/Rubik-Bold.ttf'),
        'Rubik-BoldItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-BoldItalic.ttf'),
        'Rubik-Italic': require('./node_modules/@shoutem/ui/fonts/Rubik-Italic.ttf'),
        'Rubik-Light': require('./node_modules/@shoutem/ui/fonts/Rubik-Light.ttf'),
        'Rubik-LightItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-LightItalic.ttf'),
        'Rubik-Medium': require('./node_modules/@shoutem/ui/fonts/Rubik-Medium.ttf'),
        'Rubik-MediumItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-MediumItalic.ttf'),
        'Rubik-Regular': require('./node_modules/@shoutem/ui/fonts/Rubik-Regular.ttf'),
        'rubicon-icon-font': require('./node_modules/@shoutem/ui/fonts/rubicon-icon-font.ttf'),
        'Roboto-Black': require('./assets/fonts/Roboto/Roboto-Black.ttf'),
        'Roboto-BlackItalic': require('./assets/fonts/Roboto/Roboto-BlackItalic.ttf'),
        'Roboto-Bold': require('./assets/fonts/Roboto/Roboto-Bold.ttf'),
        'Roboto-BoldItalic': require('./assets/fonts/Roboto/Roboto-BoldItalic.ttf'),
        'Roboto-Italic': require('./assets/fonts/Roboto/Roboto-Italic.ttf'),
        'Roboto-Light': require('./assets/fonts/Roboto/Roboto-Light.ttf'),
        'Roboto-LightItalic': require('./assets/fonts/Roboto/Roboto-LightItalic.ttf'),
        'Roboto-Medium': require('./assets/fonts/Roboto/Roboto-Medium.ttf'),
        'Roboto-MediumItalic': require('./assets/fonts/Roboto/Roboto-MediumItalic.ttf'),
        'Roboto-Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
        'Roboto': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
        'Roboto-Thin': require('./assets/fonts/Roboto/Roboto-Thin.ttf'),
        'Roboto-ThinItalic': require('./assets/fonts/Roboto/Roboto-ThinItalic.ttf'),
      });
    } catch (e) {

    } finally {
      this.setState({fontsAreLoaded: true});
    }
    
    try {
      await cacheAssetsAsync({
        images: [require('./assets/images/expo-wordmark.png')],
        fonts: [
          FontAwesome.font,
          { 'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
            'Rubik-Black': require('./node_modules/@shoutem/ui/fonts/Rubik-Black.ttf'),
            'Rubik-BlackItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-BlackItalic.ttf'),
            'Rubik-Bold': require('./node_modules/@shoutem/ui/fonts/Rubik-Bold.ttf'),
            'Rubik-BoldItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-BoldItalic.ttf'),
            'Rubik-Italic': require('./node_modules/@shoutem/ui/fonts/Rubik-Italic.ttf'),
            'Rubik-Light': require('./node_modules/@shoutem/ui/fonts/Rubik-Light.ttf'),
            'Rubik-LightItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-LightItalic.ttf'),
            'Rubik-Medium': require('./node_modules/@shoutem/ui/fonts/Rubik-Medium.ttf'),
            'Rubik-MediumItalic': require('./node_modules/@shoutem/ui/fonts/Rubik-MediumItalic.ttf'),
            'Rubik-Regular': require('./node_modules/@shoutem/ui/fonts/Rubik-Regular.ttf'),
            'rubicon-icon-font': require('./node_modules/@shoutem/ui/fonts/rubicon-icon-font.ttf'),
            'Roboto-Black': require('./assets/fonts/Roboto/Roboto-Black.ttf'),
            'Roboto-BlackItalic': require('./assets/fonts/Roboto/Roboto-BlackItalic.ttf'),
            'Roboto-Bold': require('./assets/fonts/Roboto/Roboto-Bold.ttf'),
            'Roboto-BoldItalic': require('./assets/fonts/Roboto/Roboto-BoldItalic.ttf'),
            'Roboto-Italic': require('./assets/fonts/Roboto/Roboto-Italic.ttf'),
            'Roboto-Light': require('./assets/fonts/Roboto/Roboto-Light.ttf'),
            'Roboto-LightItalic': require('./assets/fonts/Roboto/Roboto-LightItalic.ttf'),
            'Roboto-Medium': require('./assets/fonts/Roboto/Roboto-Medium.ttf'),
            'Roboto-MediumItalic': require('./assets/fonts/Roboto/Roboto-MediumItalic.ttf'),
            'Roboto-Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
            'Roboto': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
            'Roboto-Thin': require('./assets/fonts/Roboto/Roboto-Thin.ttf'),
            'Roboto-ThinItalic': require('./assets/fonts/Roboto/Roboto-ThinItalic.ttf') },
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

  async logIn() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('214299995728740', {
        permissions: ['public_profile', 'email', 'user_friends'],
      });
    if (type === 'success') {
      // Build Firebase credential with the Facebook access token.
      const credential = firebase.auth.FacebookAuthProvider.credential(token);

      // Sign in with credential from the Facebook user.
      firebase.auth().signInWithCredential(credential).catch((error) => {
        console.log(error)
      });
    }
   }


  render() {

    if (this.state.appIsReady) {
      if (this.state.userLoaded) {
        return (
          <ThemeProvider uiTheme={uiTheme}>
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
          </ThemeProvider>
        );
      } else {
        <View style={styles.container}>
          <Text>Welcome to Foodiez! Please log in</Text>
        </View>
      }
    } else {
      return <Expo.AppLoading />;
    }
    return (
      <View style={styles.container}>
        <Text>Welcome to Foodiez! Please log in</Text>
      </View>);
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
