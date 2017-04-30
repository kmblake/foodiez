
import * as firebase from "firebase";
import { AsyncStorage } from 'react-native';
import Expo from 'expo';

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
}

module.exports = Firebase;