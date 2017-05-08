import { createRouter } from '@expo/ex-navigation';

import HomeScreen from '../screens/HomeScreen';
import DefaultScreen from '../screens/DefaultScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AvailabilityScreen from '../screens/AvailabilityScreen';
import PickDateScreen from '../screens/PickDateScreen';
import InviteFriendsScreen from '../screens/InviteFriendsScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import PickRecipesScreen from '../screens/PickRecipesScreen';
import ViewEventScreen from '../screens/ViewEventScreen';
import ConfirmEventScreen from '../screens/ConfirmEventScreen';
import RootNavigation from './RootNavigation';
import HostedEventsScreen from '../screens/HostedEventsScreen';

export default createRouter(() => ({
  home: () => HomeScreen,
  hosting: () => HostedEventsScreen,
  links: () => DefaultScreen,
  settings: () => SettingsScreen,
  availability: () => AvailabilityScreen,
  rootNavigation: () => RootNavigation,
  pickDate: () => PickDateScreen,
  inviteFriends: () => InviteFriendsScreen,
  createEvent: () => CreateEventScreen,
  viewEvent: () => ViewEventScreen,
  pickRecipes: () => PickRecipesScreen,
  confirmEvent: () => ConfirmEventScreen
}));
