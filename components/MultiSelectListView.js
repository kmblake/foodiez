import React from 'react';
import { StyleSheet, View, Button, ListView, TouchableOpacity } from 'react-native';
import { Container, Content, Body, ListItem, Text, CheckBox } from 'native-base';
import Router from '../navigation/Router';
import Database from "../firebase/database";


export default class MultiSelectListView extends React.Component {

  // Pass in renderRowContents function to render contents of row, 
  // onSelectionChanged callback to get filtered data,
  // dataSource as array of items to render
  // initialCheckboxState = initial state of checkbox

  constructor(props) {
    super(props);
    this.ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.dataWithChecked = props.dataSource.map((item) => {
      item.checked = !!this.props.initialCheckboxState;
      return item;
    });
    this.state = {
      items: this.ds.cloneWithRows(this.dataWithChecked)
    };
  }

  onPressRow(rowID) {
    this.dataWithChecked[rowID].checked = !this.dataWithChecked[rowID].checked;
    const selectedItems = this.dataWithChecked.filter( (item) => {
      return item.checked;
    });
    this.props.onSelectionChanged(selectedItems);
    this.setState({items: this.ds.cloneWithRows(this.dataWithChecked)});
  }

  renderRow(item, sectionID, rowID) {
    const rowContents = this.props.renderRowContents(item);
    return (
      <ListItem onPress={() => (this.onPressRow(rowID))}>
          <Body>
              <Text>{rowContents}</Text>
          </Body>
          <CheckBox checked={item.checked} />
      </ListItem>
    );
  }

  render() {
    return (
      <ListView
          dataSource={this.state.items}
          renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
});