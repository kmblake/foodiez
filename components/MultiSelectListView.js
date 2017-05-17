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
      if (item.checked === undefined) item.checked = !!this.props.initialCheckboxState;
      return item;
    });
    this.state = {
      items: this.ds.cloneWithRows(this.dataWithChecked)
    };
    // Initialize selectedItems in parents
    const selectedItems = this.dataWithChecked.filter( (item) => {
      return item.checked;
    });
    this.props.onSelectionChanged(selectedItems);
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
      <ListItem onPress={() => (this.onPressRow(rowID))} onLongPress={() => console.log("long press 1")}>
          <Body>
              <View>{rowContents}</View>
          </Body>
          <CheckBox checked={item.checked} />
      </ListItem>
    );
  }
 componentWillReceiveProps(newProps) {
    this.dataWithChecked = newProps.dataSource.map((item) => {
      if (item.checked === undefined) item.checked = !!this.props.initialCheckboxState;
      return item;
    });
    this.setState({
      items: this.ds.cloneWithRows(this.dataWithChecked)
    });
    const selectedItems = this.dataWithChecked.filter( (item) => {
      return item.checked;
    });
    this.props.onSelectionChanged(selectedItems);
  }

  render() {
    return (
      <ListView
          dataSource={this.state.items}
          renderRow={(rowData, sectionID, rowID) => this.renderRow(rowData, sectionID, rowID)}
          enableEmptySections={true}
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