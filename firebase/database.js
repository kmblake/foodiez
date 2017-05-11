
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

  static async syncFriends(token, uid) {
    const url = "https://graph.facebook.com/v2.9/me?fields=friends&access_token=" + token; 
    const response = await fetch(url);
    const data = await response.json();
    friends = [];
    const userRef = firebase.database().ref('users')
    for (i in data.friends.data) {
      const friend = data.friends.data[i];
      const friendName = friend.name;
      const userSnap = await userRef.orderByChild('name').equalTo(friend.name).once('value');
      const userObj = userSnap.val();
      if (!!userObj) {
        const friendUid = Object.keys(userObj)[0];
        friends.push(friendUid);
        userFriends = (!!userObj.friends) ? userObj.friends : [];
        if (userFriends.indexOf(uid) < 0) {
          userFriends.push(uid);
          const res = await firebase.database().ref("/users/" + userObj.uid).update({friends: userFriends});
        }
      }
    }
    return firebase.database().ref("/users/" + uid).update({friends: friends});
  }

  static async getBestDays() {
    const curUserAuth = firebase.auth().currentUser;
    const curUserSnapshot = await firebase.database().ref('/users/' + curUserAuth.uid).once('value');
    const curUser = curUserSnapshot.val();
    availabilityHash = {'Sunday': [], 'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': [], 'Saturday': []}
    daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    for (i in curUser.friends) {
      const fuid = curUser.friends[i];
      const friendSnapshot = await firebase.database().ref('/users/' + fuid).once('value');
      const friend = friendSnapshot.val();
      
      for (day in friend.availability) {
        day = parseInt(day);
        if (curUser.availability.indexOf(day) >= 0) {
          availabilityHash[daysOfWeek[day]].push({uid: fuid, name: friend.name, photoURL: friend.photoURL})
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
    return availability
  }

  // static getBestDays() {
  //   const curUserAuth = firebase.auth().currentUser;

  //   var getBestDaysGivenCurUserSnapshot = ((curUserSnapshot) => {
  //     const curUser = curUserSnapshot.val();
  //     return new Promise( (resolve, reject) => {
  //       firebase.database().ref('/users').once('value').then((snapshot) => {
  //         try {
  //           userData = snapshot.val();
  //           availabilityHash = {'Sunday': [], 'Monday': [], 'Tuesday': [], 'Wednesday': [], 'Thursday': [], 'Friday': [], 'Saturday': []}
  //           daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  //           for (const id in userData) {
  //             if (id != curUserAuth.uid) {
  //               var user = userData[id];
  //               for (day in user.availability) {
  //                 day = parseInt(day);
  //                 if (curUser.availability.indexOf(day) >= 0) {
  //                   availabilityHash[daysOfWeek[day]].push({uid: id, name: user.name, photoURL: user.photoURL})
  //                 }
  //               }
  //             }
  //           }
  //           availability = []
  //           for (day in availabilityHash) {
  //             availability.push({
  //               day: day,
  //               users: availabilityHash[day]
  //             });
  //           }
  //           resolve(availability);
  //         } catch (e) {
  //           reject(e);
  //         }
  //       });
  //     });
  //   });
  //   //TODO: Update to query only friends
  //   return firebase.database().ref('/users/' + curUserAuth.uid).once('value').then(getBestDaysGivenCurUserSnapshot);
  // }

  static async makeVenmoURL(event, curUid) {
    const snapshot = await firebase.database().ref('/users/' + curUid).once('value');
    const user = snapshot.val();
    if (!!user.venmo) {
      var url = 'https://venmo.com/?txn=pay&audience=friends&recipients=';
      url += user.venmo;
      url += '&amount=' + event.cost;
      url += '&note=Dinner%20(foodiez)';
      return url;
    } else {
      return null;
    }
  }

  static async createEvent(event, invitedFriends) {
    //TODO: add error checking
    const curUid = firebase.auth().currentUser.uid;
    const venmoURL = await Database.makeVenmoURL(event, curUid);
    event.venmoURL = venmoURL;
    const eventRef = firebase.database().ref('events').push(event);
    const eventId = eventRef.key;
    var deadline = new Date(event.date);
    deadline.setDate(deadline.getDate() - 1);
    for (i in invitedFriends) {
      const friend = invitedFriends[i];
      firebase.database().ref('invitations').push({
        eventId: eventId, 
        uid: friend.uid, 
        accepted: null, 
        event_date: event.date,
        deadline: deadline.getTime(),
        paid: false
      });
    }
    firebase.database().ref('invitations').push({eventId: eventId, uid: curUid, accepted: true, event_date: event.date,});
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
              cost: event.cost,
              invitation: {
                id: Object.keys(invites)[i],
                accepted: Object.values(invites)[i].accepted,
                deadline: Object.values(invites)[i].deadline,
                paid: Object.values(invites)[i].paid
              }
            });
          });
          resolve(events);
      });
     });
    });

  }

  static async getAttendance(eventId) {
    const eventRef = firebase.database().ref('/events/' + eventId);

    let snapshot = await eventRef.once('value');
    var attending = snapshot.val().attending;
    if (attending === undefined || attending == null) {
      attending = [];
    }

    const invitationRef = firebase.database().ref('invitations');
    let invitesSnap = await invitationRef.orderByChild('eventId').equalTo(eventId).once('value')
    let invites = invitesSnap.val();

    var attendance = []
    for (const id in invites) {
      let invite = invites[id]
      let userSnap = await firebase.database().ref('/users/' + invite.uid).once('value');
      let user = userSnap.val();
      attendance.push({
        name: user.name,
        uid: invite.uid,
        photoURL: user.photoURL,
        accepted: invite.accepted
      });
    }
    return attendance
  }

  static async notifyHost(event, accepted, curUser) {
    const hostId = event.host.uid;
    const PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';
    const eventTypeToText = {
      'tapas': 'Tapas Night', 
      'summer_bbq': 'Summer BBQ', 
      'taco_night': 'Taco Night', 
      'pizza': 'Pizza Party', 
      'custom': 'Dinner'};
    const status = !!accepted ? 'attending' : 'not attending';
    const message = curUser.displayName + ' is ' + status + ' ' + eventTypeToText[event.type];
    const hostSnap = await firebase.database().ref('/users/' + hostId).once('value');
    const host = hostSnap.val()
    if (!!host.token) {
      var notifications = [];
      notifications.push({
        to: host.token,
        body: message,
        data: {
          message: message
        }
      });
      const response = await fetch(PUSH_ENDPOINT, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-Encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notifications),
      });
      console.log(response);
    }
  }

  static async respondToInvite(event, accepted) {
    //TODO: Handle failure?
    const curUser = firebase.auth().currentUser;
    const eventRef = firebase.database().ref('/events/' + event.id);
    const invitationRef = firebase.database().ref('/invitations/' + event.invitation.id);
    invitationRef.update({accepted: accepted});
    const snapshot = await eventRef.once('value');
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
    Database.notifyHost(event, accepted, curUser)



  //   .then((snapshot) => {
      
  //     try {
  //       var notifications = [];
  //       notifications.push({
  //         to: user.token,
  //         body: inviteMessage,
  //         data: {
  //           message: inviteMessage
  //         }
  //       });
  //     }
  //   });
  }


}

module.exports = Database;