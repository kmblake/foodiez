
import * as firebase from "firebase";
import Moment from 'moment';

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

  static async syncFriends(token, uid, name) {
    const url = "https://graph.facebook.com/v2.9/me?fields=friends&access_token=" + token; 
    const response = await fetch(url);
    const data = await response.json();
    friends = [];
    const userRef = firebase.database().ref('users')
    var notifications = []
    for (i in data.friends.data) {
      const friend = data.friends.data[i];
      const friendName = friend.name;
      const userSnap = await userRef.orderByChild('name').equalTo(friend.name).once('value');
      const userMatch = userSnap.val();

      if (!!userMatch) {
        const friendUid = Object.keys(userMatch)[0];
        const userObj = userMatch[friendUid]
        friends.push(friendUid);
        userFriends = (!!userObj.friends) ? userObj.friends : [];
        if (userFriends.indexOf(uid) < 0) {
          userFriends.push(uid);
          const res = await firebase.database().ref("/users/" + friendUid).update({friends: userFriends});
          if (!!userObj.token) {
            const joinedMessage = "Your friend " + name + " just joined Foodiez!";
            notifications.push({
              to: userObj.token,
              body: joinedMessage,
              data: {
                message: joinedMessage
              }
            });
          }
        }
      }
    }
    const PUSH_ENDPOINT = 'https://exp.host/--/api/v2/push/send';
    const notificationResponse = await fetch(PUSH_ENDPOINT, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-Encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notifications),
    });
    const resText = await (notificationResponse.text());
    const success = await firebase.database().ref("/users/" + uid).update({friends: friends});
    return success;
  }

  static async getFriends() {
    const curUserAuth = firebase.auth().currentUser;
    const curUserSnapshot = await firebase.database().ref('/users/' + curUserAuth.uid).once('value');
    const curUser = curUserSnapshot.val();
    var friends = []
    for (i in curUser.friends) {
      const fuid = curUser.friends[i];
      const friendSnapshot = await firebase.database().ref('/users/' + fuid).once('value');
      const friend = friendSnapshot.val();
      friends.push({uid: fuid, name: friend.name, photoURL: friend.photoURL});
    }
    return friends;

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
      
      for (var j = 0; j < friend.availability.length; j++) {
        var day = friend.availability[j];
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
    return {availability: availability, userAvailability: curUser.availability}
  }

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
    const inviteMessage = curUser.displayName + " invited you to " + event.name + "!";
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

  static async deleteEvent(eventId) {
    const eventRef = firebase.database().ref('events');
    const invitationRef = firebase.database().ref('invitations');
    const invitesSnap = await invitationRef.orderByChild('eventId').equalTo(eventId).once('value');
    const invites = invitesSnap.val();
    for (id in invites) {
      // Send notification?
      const success = await firebase.database().ref('invitations/' + id).remove();
    }
    return firebase.database().ref('events/' + eventId).remove()
  }


  static async getEvents() {
    const curUid = firebase.auth().currentUser.uid;
    const eventRef = firebase.database().ref('events');
    const invitationRef = firebase.database().ref('invitations');
    const userRef = firebase.database().ref('users')
    const dateThreshold = parseInt(Moment().subtract(3, 'hours').format('x'));
    const invitesSnap = await invitationRef.orderByChild('uid').equalTo(curUid).once('value');
    const invites = invitesSnap.val();
    var events = [];
    for (id in invites) {
      const invite = invites[id];
      if (invite.event_date > dateThreshold) {
        const eventSnap = await firebase.database().ref('events/' + invite.eventId).once('value');
        const event = eventSnap.val();
        var attending = []
        if (!!event.attending) attending = event.attending;
        events.push({
          id: invite.eventId,
          type: event.type,
          name: event.name,
          attending: attending,
          date: event.date,
          description: event.description,
          host: event.host,
          location: event.location,
          cost: event.cost,
          venmoURL: event.venmoURL,
          recipes: event.recipes,
          invitation: {
            id: id,
            accepted: invite.accepted,
            deadline: invite.deadline,
            paid: invite.paid
          }
        });
      }
      events.sort((e1, e2) => {
        return e1.date - e2.date
      });
    }
    return events;
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
    const message = curUser.displayName + ' is ' + status + ' ' + event.name;
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
      // console.log(response);
      //TODO: Handle response
    }
  }

  static async respondToInvite(event, accepted) {
    const curUser = firebase.auth().currentUser;
    const eventRef = firebase.database().ref('/events/' + event.id);
    const invitesSnap = await firebase.database().ref('invitations').orderByChild('eventId').equalTo(event.id).once('value')
    const invites = invitesSnap.val();
    attending = []
    for (const id in invites) {
      var invite = invites[id];
      const userSnap = await firebase.database().ref('users/' + invite.uid).once('value');
      const user = userSnap.val();
      if (invite.accepted === undefined) invite.accepted = null;
      if (invite.uid === curUser.uid) {
        invite.accepted = accepted;
        const invitationRef = firebase.database().ref('/invitations/' + id);
        const res = await invitationRef.update({accepted: accepted});
      }
      attending.push({
        name: user.name,
        photoURL: user.photoURL,
        uid: invite.uid,
        accepted: invite.accepted
      });
    }
    eventRef.update({attending: attending});
    Database.notifyHost(event, accepted, curUser)
  }


}

module.exports = Database;