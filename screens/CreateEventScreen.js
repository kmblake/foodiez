import React from 'react';
import { StyleSheet, Text, TextInput , View, DatePickerIOS, ListView, Dimensions, TouchableOpacity, TouchableHighlight, Image, Keyboard, TouchableWithoutFeedback, Platform, TimePickerAndroid} from 'react-native';
import DefaultScreen from '../screens/DefaultScreen';
import Router from '../navigation/Router';
import Database from "../firebase/database";
import { Container, Content, Item, Input, Form, Label, Header, CardItem, TabHeading, Right, Left, ScrollableTab, Icon, Body, Title, Tab, Tabs } from 'native-base';
import Carousel from 'react-native-carousel';
import recipeData from "../firebase/recipes.json"
import { Card, Button } from 'react-native-material-ui'
import Moment from 'moment'

 
export default class CreateEventScreen extends DefaultScreen {
  static route = {
    navigationBar: {
      title: 'Event Details',
    }
  };

  

  constructor(props) {
    super(props);
    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    const eventTypes = ['BBQ', 'Tapas Night', 'Picnic', 'Dinner'];
    this.state = {
      logged_in: false, 
      date: new Date(props.route.params.date),
      eventType: 'Dinner',
      eventTypes: eventTypes,
      description: "",
      location: "",
      showDatePicker: true,
      name: ""
    };
  }

  formatEvent() {
    const invitedFriends = this.state.invitedFriends
    const dateString = this.state.date.toString();
    const curUser = {
        name: this.state.user.displayName,
        uid: this.state.user.uid,
        photoURL: this.state.user.photoURL
    };
    var event = {
      type: 'Custom',
      date: this.state.date.getTime(),
      description: this.state.description,
      location: this.state.location,
      host: curUser,
      attending: [curUser],
      name: (!!this.state.name) ? this.state.name : 'Dinner'
    };
    return event;
  }

  onNextTap() {
    var event = this.formatEvent();
    event.type = 'custom'
    this.props.navigator.push(Router.getRoute('confirmEvent', 
      {event: JSON.stringify(event), invitedFriends: this.props.route.params.invitedFriends}));
  }

  onMenuPress(eventType) {
    var event = this.formatEvent();
    event.type = eventType
    this.props.navigator.push(Router.getRoute('pickRecipes', 
      {event: JSON.stringify(event), invitedFriends: this.props.route.params.invitedFriends}));
  }

  async onDatePress() {
    Keyboard.dismiss();
    if (Platform.OS === 'android') {
     const {action, minute, hour} = await TimePickerAndroid.open({hour: this.state.date.getHours(), minute: this.state.date.getMinutes()});
     if (action === TimePickerAndroid.timeSetAction) {
        var date = new Date(this.state.date);
        date.setHours(hour);
        date.setMinutes(minute);
        this.onDateChange(date);
     }
      
    } else {
      this.setState({
        showDatePicker: !this.state.showDatePicker
      })
    }
    
  }

  renderCarousel() {

    var {height, width} = Dimensions.get('window');
    const eventTypeToText = {
      'tapas': 'Tapas Night', 
      'summer_bbq': 'Summer BBQ', 
      'taco_night': 'Taco Night', 
      'pizza': 'Pizza Party', 
      'custom': 'Dinner'};
    var carouselViews = Object.keys(recipeData.recipes).map( (key) => {
      const title = eventTypeToText[key]
      return (
        <View width={width} key={key} style={styles.carouselRow} >
          <Card onPress={() => this.onMenuPress(key)}>
            <View style={styles.eventTypeView} >
              <Image style={{ height: height*4/10, width: width - 10, resizeMode: 'contain'}} source={{uri: recipeData.recipes[key][0].photoURL}} />
              <Text style={styles.menuTheme} >{title}</Text>
            </View>
          </Card>
        </View>
      );
    });
    return (
      <Carousel width={width} style={styles.carouselContainer} animate={false} indicatorOffset={20}>
        {carouselViews}
      </Carousel>
    );
  }

  renderDatePicker() {
    if (this.state.showDatePicker) {
      if (Platform.OS === 'ios') {
        return (
        <DatePickerIOS
           date={this.state.date}
           mode="time"
           onDateChange={this.onDateChange.bind(this)}
         />);
      } 
    } 
  }

  onDateChange(date) {
    this.setState({date: date});
  }

  renderView() {
    const carousel = this.renderCarousel();
    const datePicker = this.renderDatePicker();
    return (  
      <View style={styles.container}>
      <Form>
        <Item regular>
          <Input 
            placeholder='Name'
            onChangeText={(text) => this.setState({name: text})}
            value={this.state.name}/>
        </Item>
        <Item regular>
          <Input 
            placeholder='Description'
            onChangeText={(text) => this.setState({description: text})}
            value={this.state.text}/>
        </Item>
        <Item regular>
          <Input 
            placeholder='Location'
            onChangeText={(text) => this.setState({location: text})}
            value={this.state.location}/>
        </Item>
        <Item fixedLabel last
          onPress={this.onDatePress.bind(this)}
        >
          <Label>Time</Label>
          <Input disabled
            placeholder='Location'
            onChangeText={(text) => this.setState({location: text})}
            value={Moment(this.state.date).format("ddd MMM Do h:mm a")}/>
        </Item>
      </Form>
      

      {datePicker}

      <Button
        primary 
        onPress={() => (this.onMenuPress('tapas'))}
        text="Choose Theme & Recipes"
      />  
      <Button
        primary 
        onPress={() => (this.onNextTap())}
        text="Confirm Event Details"
      />

      </View>
    );
  }
}



      // <TouchableWithoutFeedback style={styles.container} onPress={() => this.setState({showDatePicker: false}) }>
      //   <View style={styles.container}>
      //     <Text style={styles.menuPrompt}>Create an awesome menu. Choose a seasonal theme below:</Text>
      //     {carousel}
      //   </View>
      // </TouchableWithoutFeedback> 
      

 // <Header hasTabs>
          
 //    <Body>
 //      <Title>Themes</Title>
 //    </Body>
    
 //  </Header>
 //  <Tabs>
 //    <Tab heading={ <TabHeading><Text>Theme 1</Text></TabHeading>}>
      
 //    </Tab>
 //    <Tab heading={ <TabHeading><Text>Theme 2</Text></TabHeading>}>
      
 //    </Tab>
 //  </Tabs>


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
  },
  menuPrompt: {
    textAlign: 'center',
    color: 'rgba(0,0,0,0.4)'
  },
  menuTheme: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontStyle: 'italic'
  },
  skipMenuButton: {
    fontSize: 10
  },
  carouselContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  carouselRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  col: {
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center', // this will prevent TFs from stretching horizontal
    marginLeft: 7, marginRight: 7,
    // backgroundColor: MKColor.Lime,
  },
  textfield: {
    height: 28,  // have to do it on iOS
    marginTop: 32,
  },
  textfieldWithFloatingLabel: {
    height: 48,  // have to do it on iOS
    marginTop: 10,
  },
  recipeImage: {
    height: 250,
    width: 350,
    resizeMode: 'contain'
  },
  eventTypeView: {
    flex: 1,
    flexDirection: 'column'
  }
});