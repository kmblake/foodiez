
import * as firebase from "firebase";

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
      // Get the user's name using Facebook's Graph API
      const response = await fetch(
        `https://graph.facebook.com/me?access_token=${token}`);
      // console.log(response.json())
      Alert.alert(
        'Logged in!',
        `Hi ${(await response.json()).name}!`,
      );
    }
   }

}

module.exports = Firebase;