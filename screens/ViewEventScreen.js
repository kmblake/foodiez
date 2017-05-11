import React from 'react';
import { StyleSheet, Text, View, Image, Linking, ActivityIndicator, ListView, SegmentedControlIOS} from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import { Toolbar, Button, Card, ListItem, Avatar } from 'react-native-material-ui';

export default class ViewEventScreen extends React.Component {
  static route = {
    navigationBar: {
      title: 'View Event',
    }
  };

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const event = JSON.parse(props.route.params.event);
    this.state = {
      event: event,
      users: this.ds.cloneWithRows(event.attending)
    };
  }

  componentWillMount() {
    this.updateData();
  }

  updateData() {
    Database.getAttendance(this.state.event.id).then( (attending) => {
      this.setState({
      users: this.ds.cloneWithRows(attending)
      });
    }).catch( (error) => {
      console.error(error);
    });
  }

  renderWebView() {
    var url = this.state.event.venmoURL;
    console.log
    Linking.canOpenURL(url).then(supported => {
      if (!supported) {
        console.log('Can\'t handle url: ' + url);
      } else {
        return Linking.openURL(url);
      }
    }).catch(err => console.error('An error occurred', err));
  }
  

  render() {
    // const isAttending = (!!user.accepted) ? 'is attending!' : '';
    const d = new Date(this.state.event.date);
    // const inviteResponseSelector = this.renderAttending();
    return (
      <View>
      <Card>
        <ListItem
          leftElement={<Image source={{uri: this.state.event.host.photoURL}} style={{width: 40, height: 40, borderRadius: 20}} />}
          centerElement={{
              primaryText: this.state.event.type,
              secondaryText: d.toString(),
          }}
        />
        <View style={styles.textContainer}>
          <Text>
            {this.state.event.host.name} is hosting {this.state.event.type}!
          </Text>
        </View>
        <View style={styles.textContainer}>
          <Text>
            Are you planning to attend?
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
            <Button primary text="Yes" icon="done" onPress={() => Database.respondToInvite(this.state.event, true)} />
          </View>
          <View style={styles.button}>
              <Button accent text="No" icon="clear" onPress={() => Database.respondToInvite(this.state.event, false)} />
          </View>
          <View style={styles.button}>
              <Button secondary text="Not Sure" icon="question" onPress={() => Database.respondToInvite(this.state.event, null)} />
          </View>
        </View>
        <ListView
          scrollEnabled={false}
          dataSource={this.state.users}
          renderRow={(user) => <Text>{user.name}  {(!!user.accepted) ? 'is attending!' : ''}</Text>}
        />
      </Card>
      <Card >
        <View style={styles.textContainer}>
            <Text>
                Attendees
            </Text>
        </View>
        <ListView
          dataSource={this.state.users}
          renderRow={(user) =><ListItem
            leftElement={<Image source={{uri: user.photoURL}} style={{width: 40, height: 40, borderRadius: 20}} />}
            centerElement={{
                primaryText: user.name,
                secondaryText: (!(user.accepted == null)) ? ( (!!user.accepted) ? 'is attending!' : 'not attending :(') : 'not sure if attending' ,
            }}
        />}
        />
      </Card>
      <Card style={styles.card} >
        <View style={styles.textContainer}>
            <Text>
                Suggest Donation Amount $5
            </Text>
        </View>
        <View style={styles.buttonContainer}>
          <View style={styles.button}>
              <Button primary text="Pay With Venmo" icon="monetization-on" onPress={() => this.renderWebView()} />
          </View>
        </View>
      </Card>
      </View>
    );
  }

  //{inviteResponseSelector}
  // _onInviteResponseChange(event) {
  //   const newIndex = event.nativeEvent.selectedSegmentIndex;
  //   const selectorIndexToAccepted = [true, false, null];
  //   console.log("New invite status");
  //   console.log(selectorIndexToAccepted[newIndex]);
  //   Database.respondToInvite(this.state.event, selectorIndexToAccepted[newIndex]);

  // }

  // renderAttending() {
  //   const acceptedToSelectorIndex = {true: 0, false: 1, undefined: 2};
  //   const values = ['Yes!', 'No', 'Not Sure'];
  //   const value = 'Not selected';
  //   const selectedIndex = acceptedToSelectorIndex[this.state.event.invitation.accepted];
  //     return (
  //       <SegmentedControlIOS
  //         values={values}
  //         selectedIndex={selectedIndex}
  //         onChange={this._onInviteResponseChange.bind(this)} />
  //     );
  // } 


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  textContainer: {
    paddingLeft: 10,
    paddingBottom: 10,
    paddingRight: 10,
  },
  button: {
    marginHorizontal: 8,
  },
  card: {
    flex: 2,
    flexDirection: 'column',

  },
  buttonContainer: {
    flex: 20, 
    flexDirection: 'row', 
    height: 30,
    paddingBottom: 10,
  }
});