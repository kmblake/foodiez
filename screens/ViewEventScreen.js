import React from 'react';
import { StyleSheet, Text, View, Button, ActivityIndicator, ListView} from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";


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

  onDoneTap() {
    this.props.navigator.push(Router.getRoute('home'));
  }

  render() {
    // const isAttending = (!!user.accepted) ? 'is attending!' : '';
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {this.state.event.type} ({this.state.event.id}) Host: {this.state.event.host.name} 
        </Text>
        <Text>Attending</Text>
        <ListView
          dataSource={this.state.users}
          renderRow={(user) => <Text>{user.name} ({user.uid}) {(!!user.accepted) ? 'is attending!' : ''}</Text>}
        />
        <Button
          onPress={() => (this.onDoneTap())}
          title="Done"
          color="#841584"
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
});