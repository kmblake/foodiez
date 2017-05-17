import React from 'react';
import { StyleSheet, View, ListView, TouchableHighlight, Image, Text, Linking, Dimensions } from 'react-native';
import { Container, Content, Item, Input, Form, Label, Header, CardItem, Card, Body, Title, TabHeading, Icon, Tab, Tabs  } from 'native-base';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import RecipeListView from "../components/RecipeListView";
import recipeData from "../firebase/recipes.json"
import { Button } from 'react-native-material-ui'
import Carousel from 'react-native-carousel';


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
      eventType: 'Dinner',
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

  renderTabs() {
    var {height, width} = Dimensions.get('window');
    const eventTypeToText = {
      'tapas': 'Tapas Night', 
      'summer_bbq': 'Summer BBQ', 
      'taco_night': 'Taco Night', 
      'pizza': 'Pizza Party', 
      'custom': 'Dinner'};
    var tabs = Object.keys(recipeData.recipes).map( (key) => {
      const title = eventTypeToText[key]
      return (
        <Tab heading={ <TabHeading><Text> {title} </Text></TabHeading>}>
         <Image style={{ height: height*4/10, width: width - 10, resizeMode: 'contain'}} source={{uri: recipeData.recipes[key][0].photoURL}} />
          <Text style={styles.prompt} >Tip: Press and hold to view the full recipe!</Text>
          <RecipeListView
            dataSource={recipeData.recipes[key]}
            onSelectionChanged={this.onSelectionChanged.bind(this)}
          />
        </Tab>
      );
    });
    return tabs;
  }

  renderView() {
    const nextButton = this.renderNextButton();
    const tabs = this.renderTabs();
    return (
      <View style={styles.container}>
        <Tabs tabStyle={styles.tabStyle} >
          {tabs}
        </Tabs>
        {nextButton}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  prompt: {
    textAlign: 'center',
    color: 'rgba(0,0,0,0.4)'
  },
});