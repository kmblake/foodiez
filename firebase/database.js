
import * as firebase from "firebase";

class Database {

  static testMethod() {
    firebase.database().ref('testData/1').set({
      posted: true
    });
  }

  static setUserData(userId, data) {
    let userPath = "/users/" + userId;
    return firebase.database().ref(userPath).update(data);
  }

  /**
   * Listen for changes to a users mobile number
   * @param userId
   * @param callback Users mobile number
   */
  static listenUserMobile(userId, callback) {

    let userMobilePath = "/users/" + userId + "/details";

    firebase.database().ref(userMobilePath).on('value', (snapshot) => {

      var mobile = "";

      if (snapshot.val()) {
          mobile = snapshot.val().mobile
      }

      callback(mobile)
    });
  }

}

module.exports = Database;