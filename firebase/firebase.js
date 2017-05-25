
import * as firebase from "firebase";
import { AsyncStorage } from 'react-native';
import Expo from 'expo';
import Database from './database'

class Firebase {

 /**
  * Initialises Firebase
  */
  static initialize() {
    firebase.initializeApp({
      apiKey: "AIzaSyAfNVmsJTVPtecjbIGI-1AHuz4ifoVltu8",
      authDomain: "foodiez-94ef8.firebaseapp.com",
      databaseURL: "https://foodiez-94ef8.firebaseio.com",
      projectId: "foodiez-94ef8",
      storageBucket: "foodiez-94ef8.appspot.com",
    });
  }

  static async logIn() {
    const { type, token } = await Expo.Facebook.logInWithReadPermissionsAsync('214299995728740', {
        permissions: ['public_profile', 'email', 'user_friends'],
      });
    if (type === 'success') {
      // Build Firebase credential with the Facebook access token.
      const credential = firebase.auth.FacebookAuthProvider.credential(token);    

      // Sign in with credential from the Facebook user.
      result = await firebase.auth().signInWithCredential(credential);
      friendSyncRes = await Database.syncFriends(token, result.uid, result.displayName);
      return result;
    } else {
    return null;
   }
  }
}

module.exports = Firebase;