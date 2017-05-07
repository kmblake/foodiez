import React from 'react';
import { StyleSheet, View, Button, ListView, TouchableOpacity, Image, Text } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import MultiSelectListView from "../components/MultiSelectListView";
import recipeData from "../firebase/recipes.json"

export default class PickRecipesScreen extends DefaultScreen {
  static route = {
    navigationBar: {
      title: 'Choose Recipes',
    }
  };

  constructor(props) {
    super(props);
    const event = JSON.parse(props.route.params.event);   
   
    this.state = {
      logged_in: true, 
      event: event,
      chosenRecipes: []
    };

  }


  onNextTap() {
    this.state.event.recipes = this.state.chosenRecipes;
    this.props.navigator.push(Router.getRoute('confirmEvent', 
      {event: JSON.stringify(this.state.event), invitedFriends: this.props.route.params.invitedFriends}));
  }

  renderRowContents(recipe) {
    return (
      <Text>{recipe.title}</Text>
    );
  }

  onSelectionChanged(chosenRecipes) {
    this.state.chosenRecipes = chosenRecipes;
  }

  renderView() {
    // Add date picker
    return (
      <View
        style={styles.container}
      >
      <MultiSelectListView
        dataSource={recipeData.recipes[this.state.event.type]}
        renderRowContents={this.renderRowContents.bind(this)}
        onSelectionChanged={this.onSelectionChanged.bind(this)}
      />
      <Button
        onPress={() => (this.onNextTap())}
        title="Next"
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
  }
});