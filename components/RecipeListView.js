import React from 'react';
import { StyleSheet, View, Button, ListView, TouchableOpacity, Image, Linking } from 'react-native';
import { Container, Content, Body, ListItem, Text, CheckBox } from 'native-base';
import Router from '../navigation/Router';
import Database from "../firebase/database";


export default class RecipeListView extends React.Component {

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

  showRecipeURL(url) {
    Linking.openURL(url).catch(err => console.error('An error occurred', err));
  }

  renderRow(recipe, sectionID, rowID) {
    return (
      <ListItem onPress={() => (this.onPressRow(rowID))} onLongPress={() => {this.showRecipeURL(recipe.url)}}>
          <Body>
            <View style={styles.row}>
              <Image style={styles.recipeImage} source={{uri: recipe.photoURL}} />
              <Text style={{paddingLeft: 5}} >{recipe.title}</Text>
            </View>
          </Body>
          <CheckBox checked={recipe.checked} />
      </ListItem>
    );
  }
 componentWillReceiveProps(newProps) {
    this.dataWithChecked = newProps.dataSource.map((item) => {
      item.checked = !!this.props.initialCheckboxState;
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
  row: {
    flex: 1,
    flexDirection: 'row',
    height: 40,
    width: 300,
    alignItems: 'center'
  },
  recipeImage: {
    width: 40, 
    height: 40,
    // borderRadius: 20
  }
});