import { createRouter } from '@expo/ex-navigation';

import HomeScreen from '../screens/HomeScreen';
import DefaultScreen from '../screens/DefaultScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AvailabilityScreen from '../screens/AvailabilityScreen';
import PickDateScreen from '../screens/PickDateScreen';
import CreateEventScreen from '../screens/CreateEventScreen';
import PickRecipesScreen from '../screens/PickRecipesScreen';
import ViewEventScreen from '../screens/ViewEventScreen';
import ConfirmEventScreen from '../screens/ConfirmEventScreen';
import InviteScreen from '../screens/InviteScreen';
import RootNavigation from './RootNavigation';


export default createRouter(() => ({
  home: () => HomeScreen,
  links: () => DefaultScreen,
  settings: () => SettingsScreen,
  availability: () => AvailabilityScreen,
  rootNavigation: () => RootNavigation,
  pickDate: () => PickDateScreen,
  createEvent: () => CreateEventScreen,
  viewEvent: () => ViewEventScreen,
  pickRecipes: () => PickRecipesScreen,
  confirmEvent: () => ConfirmEventScreen,
  invite: () => InviteScreen
}));
