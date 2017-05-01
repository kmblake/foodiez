
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

  static createEvent(event, invitedFriends) {
    const curUid = firebase.auth().currentUser.uid;
    const eventRef = firebase.database().ref('events').push(event);
    const eventId = eventRef.key;
    for (i in invitedFriends) {
      const friend = invitedFriends[i];
      firebase.database().ref('invitations').push({eventId: eventId, uid: friend.uid, accepted: false});
    }
    firebase.database().ref('invitations').push({eventId: eventId, uid: curUid, accepted: true});

  }

  static getUser(uid) {

  }

  static getEvents(onEventsLoaded, onError) {
    const curUid = firebase.auth().currentUser.uid;
    const eventRef = firebase.database().ref('events');
    const invitationRef = firebase.database().ref('invitations');
    const userRef = firebase.database().ref('users')
    return invitationRef.orderByChild('uid').equalTo(curUid).once('value').then((snapshot) => {
      return new Promise( (resolve, reject) => {
        const invites = snapshot.val();
        var promises = [];
        for (const id in invites) {
          const query = eventRef.orderByKey().equalTo(invites[id].eventId);
          promises.push(query.once('value'));
        }
        Promise.all(promises).then( (snaps) => {
          var events = [];
          snaps.forEach((snap, i) => {
            var userPromises = [];
            var event = Object.values(snap.val())[0];
            events.push({
              id: Object.keys(snap.val())[0],
              type: event.type,
              attending: event.attending,
              date: event.date,
              description: event.description,
              host: event.host,
              location: event.location,
              invite: {
                id: Object.keys(invites)[i],
                accepted: Object.values(invites)[i].accepted
              }
            });
          });
          console.log('invites');
          console.log(invites);
          resolve(events);
      });
     });
    });

  }


  //     const invites = snapshot.val();
  //     var promises = [];
  //     for (const id in invites) {
  //       const query = eventRef.orderByKey().equalTo(invites[id].eventId);
  //       promises.push(query.once('value'));
  //     }
  //     Promise.all(promises).then( (snaps) => {
  //       try {
  //         var events = [];
  //         snaps.forEach((snap) => {
  //           var userPromises = [];
  //           var event = Object.values(snap.val())[0];
  //           events.push(event);

  //           // Object.values(snap.val())[0].attending.forEach( (uid) => {
  //           //   const query = userRef.orderByKey().equalTo(uid);
  //           //   userPromises.push(query.once('value'));
  //           //   Promise.all(userPromises).then( (userSnaps) => {
  //           //     var users = [];
  //           //     userSnaps.forEach( (userSnap) => {
  //           //       const user = Object.values(userSnap.val())[0];
  //           //       users.push({
  //           //         uid: Object.keys(userSnap.val())[0],
  //           //         name: user.name,
  //           //         photoURL: user.photoURL
  //           //       });
  //           //     });
  //           //     var event = Object.values(snap.val())[0];
  //           //     event.attending = users;
  //           //     event.id = Object.keys(snap.val())[0];
  //           //     events.push(event);
  //           //     console.log(events);
  //           //     onEventsLoaded(events);
  //           //   });
  //           // });
  //         });
  //         onEventsLoaded(events);
  //       } catch(e) {
  //         onError(e);
  //       }
  //     }).catch((e) => {
  //       onError(e);
  //     });
  //   });

  // }

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