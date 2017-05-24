import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Toolbar, Button, Card, ListItem, Avatar } from 'react-native-material-ui';

export class EventCard extends React.Component {
	render() {
		return (
			<Card >
        <View style={styles.header}>
          <Text style={styles.headerText}>
              {this.props.title}
          </Text>
        </View>
        {this.props.children}
      </Card>
     );
	}

}

const styles = StyleSheet.create({
  header: {
    padding: 6,
    backgroundColor: 'whitesmoke'
  },
  headerText: {
    // color: 'purple',
    // textAlign: 'center',
    fontWeight: 'bold'
  },
});