
import * as firebase from "firebase";

class Database {

  static setUserData(userId, data) {
    let userPath = "/users/" + userId;
    return firebase.database().ref(userPath).update(data);
  }

  static getUsers(uids) {
    return new Promise( (resolve, reject) => {
      try {
        const userRef = firebase.database().ref('users')
        var promises = uids.map((uid) => {
          const query = userRef.orderByKey().equalTo(uid);
          return query.once('value');
        });
        Promise.all(promises).then( (snaps) => {
          try {
            var users = [];
            snaps.forEach((snap, i) => {
              var user = Object.values(snap.val())[0];
              users.push({
                uid: Object.keys(userSnap.val())[0],
                name: user.name,
                photoURL: user.photoURL
              });
            });
            resolve(users);
          } catch(e) {
            reject(e);
          }
        });
      } catch(e) {
        reject(e);
      }
    });
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
      firebase.database().ref('invitations').push({eventId: eventId, uid: friend.uid, accepted: null});
    }
    firebase.database().ref('invitations').push({eventId: eventId, uid: curUid, accepted: true});
    Database.notifyInvitees(event, invitedFriends);

  }

  static notifyInvitees(event, invitedFriends) {
    const curUser = firebase.auth().currentUser;
    const PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';
    const eventTypeToText = {
      'tapas': 'Tapas Night', 
      'summer_bbq': 'Summer BBQ', 
      'taco_night': 'Taco Night', 
      'pizza': 'Pizza Party', 
      'custom': 'dinner'};
    const inviteMessage = curUser.displayName + " invited you to " + eventTypeToText[event.type] + "!";
    var promises = invitedFriends.map((friend) => {
      const query = firebase.database().ref('/users/' + friend.uid)
      return query.once('value');
    });
    Promise.all(promises).then( (snaps) => {
      try {
        var notifications = [];
        snaps.forEach((snap, i) => {
          var user = snap.val();
          if (!!user.token) {
            notifications.push({
              to: user.token,
              body: inviteMessage,
              data: {
                message: inviteMessage
              }
            });
          }
        });
        fetch(PUSH_ENDPOINT, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Accept-Encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(notifications),
        }).then( (response) => {
          //console.log(response);
          //TODO: Handle error with response?
        });
      } catch(e) {
        console.error(e);
      }
    });

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
            var attending = []
            if (!!event.attending) attending = event.attending;
            events.push({
              id: Object.keys(snap.val())[0],
              type: event.type,
              attending: attending,
              date: event.date,
              description: event.description,
              host: event.host,
              location: event.location,
              invitation: {
                id: Object.keys(invites)[i],
                accepted: Object.values(invites)[i].accepted
              }
            });
          });
          resolve(events);
      });
     });
    });

  }

  static getAttending(eventId) {
    const eventRef = firebase.database().ref('/events/' + eventId);
    return eventRef.once('value').then((snapshot) => {
      return new Promise( (resolve, reject) => {
        try {
          var attending = snapshot.val().attending;
          if (attending === undefined || attending == null) {
            attending = [];
          }
          resolve(attending);
        } catch(e) {
          reject(e);
        }
      });
    });
  }

  static respondToInvite(event, accepted) {
    //TODO: Handle failure?
    const curUser = firebase.auth().currentUser;
    const eventRef = firebase.database().ref('/events/' + event.id);
    const invitationRef = firebase.database().ref('/invitations/' + event.invitation.id);
    invitationRef.update({accepted: accepted});
    eventRef.once('value').then((snapshot) => {
      var event = snapshot.val();
      var attending = event.attending;
      if (!!accepted) {
        attending.push({
          name: curUser.displayName,
          photoURL: curUser.photoURL,
          uid: curUser.uid
        });
      } else {
        attending = attending.filter((user) => {
          return (user.uid != curUser.uid); 
        });
      }
      eventRef.update({attending: attending});
    });
  }


}

module.exports = Database;