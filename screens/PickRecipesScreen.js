import React from 'react';
import { StyleSheet, View, ListView, TouchableHighlight, Image, Text, Linking } from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import RecipeListView from "../components/RecipeListView";
import recipeData from "../firebase/recipes.json"
import { Button } from 'react-native-material-ui'


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

  onSelectionChanged(chosenRecipes) {
    if (this.state.chosenRecipes.length != chosenRecipes.length) {
      this.setState({
        chosenRecipes: chosenRecipes
      });
    }
  }

  renderNextButton() {
    if(this.state.chosenRecipes.length > 0) {
      return (
        <Button
          primary
          raised
          onPress={() => (this.onNextTap())}
          text="Add Recipes to Menu"
        />
      );
    }
  }

  renderView() {
    const nextButton = this.renderNextButton();
    return (
      <View
        style={styles.container}
      >
      <Text style={styles.prompt} >Tip: Press and hold to view the full recipe!</Text>
      <RecipeListView
        dataSource={recipeData.recipes[this.state.event.type]}
        onSelectionChanged={this.onSelectionChanged.bind(this)}
      />
      {nextButton}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  prompt: {
    textAlign: 'center',
    color: 'rgba(0,0,0,0.4)'
  },
});