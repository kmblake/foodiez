import React from 'react';
import {
  AsyncStorage,
  ActivityIndicator,
  StyleSheet,
  View
} from 'react-native';

import Expo from 'expo';

import Database from "../firebase/database";


export default class DefaultScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {logged_in: false}
  }

  getUserData() {
    AsyncStorage.getItem('user_data').then((user_data_json) => {
      let user_data = JSON.parse(user_data_json);
      if (user_data === null) {
        // Go home and let that component handle login
        this.props.navigator.push({component: 'home'});
      } else  {
        this.setState({
          user: user_data,
          logged_in: true
        });
      }
    }).catch( (error) => {
      console.log(error)
    });
  }

  componentDidMount() {
    this.getUserData();
  }

  // Override with view data
  renderView() {
    return (
      <View style={styles.container}>
      </View>
    );
  
  }

  render() {
    if (!this.state.logged_in) {
      return (
        <View style={styles.container}>
          <ActivityIndicator
            animating={true}
            style={[styles.centering, {height: 80}]}
            size="large"
          />
        </View>
      );
    } else {
      return this.renderView();
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
