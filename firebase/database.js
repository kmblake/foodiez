
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

  static getBestDays() {
    const curUserAuth = firebase.auth().currentUser;

    var getBestDaysGivenCurUserSnapshot = ((curUserSnapshot) => {
      const curUser = curUserSnapshot.val();
      return new Promise( (resolve, reject) => {
        firebase.database().ref('/users').once('value').then((snapshot) => {
          try {
            userData = snapshot.val();
            availabilityHash = {'Sunday': [], 'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': [], 'Saturday': []}
            daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            for (const id in userData) {
              if (id != curUserAuth.uid) {
                var user = userData[id];
                for (day in user.availability) {
                  day = parseInt(day);
                  if (curUser.availability.indexOf(day) >= 0) {
                    availabilityHash[daysOfWeek[day]].push({uid: id, name: user.name, photoURL: user.photoURL})
                  }
                }
              }
            }
            availability = []
            for (day in availabilityHash) {
              availability.push({
                day: day,
                users: availabilityHash[day]
              });
            }
            resolve(availability);
          } catch (e) {
            reject(e);
          }
        });
      });
    });
    //TODO: Update to query only friends
    return firebase.database().ref('/users/' + curUserAuth.uid).once('value').then(getBestDaysGivenCurUserSnapshot);
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