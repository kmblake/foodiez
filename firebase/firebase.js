
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

    // // Listen for authentication state to change.
    // firebase.auth().onAuthStateChanged((user) => {
    //   if (user != null) {
    //     console.log("We are authenticated now!");
    //     // console.log(user)
    //     // Firebase.user = user
    //     // AsyncStorage.setItem('user_data', JSON.stringify(user)).then((result) => {
    //     //   console.log("Successfully saved");
    //     // }).catch((error) => {
    //     //   console.log("User data save failed");
    //     //   console.log(error.message);
    //     // });
    //     try {
    //       AsyncStorage.setItem('user_data', JSON.stringify(user))
    //       this.loginCallback();
    //     } catch (error) {
    //       console.log("Could not remove user data")
    //     }
    //   } else {
    //     try {
    //       AsyncStorage.removeItem('user_data');
    //     } catch (error) {
    //       console.log("Could not remove user data")
    //     }
    //   }

    //   // Do other things
    // });
  }

  // static setUser() {
  //   const user = firebase.auth().currentUser;
  //   if (user) {
  //     Firebase.user = user
  //   } else {
  //     Firebase.logIn()
  //   }
  // }
  

  static async logIn(loginCallback) {
    this.loginCallback = loginCallback;
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
}

module.exports = Firebase;