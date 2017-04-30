import { createRouter } from '@expo/ex-navigation';

import HomeScreen from '../screens/HomeScreen';
import DefaultScreen from '../screens/DefaultScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AvailabilityScreen from '../screens/AvailabilityScreen';
import AddFriendsScreen from '../screens/AddFriendsScreen';
import RootNavigation from './RootNavigation';

export default createRouter(() => ({
  home: () => HomeScreen,
  links: () => DefaultScreen,
  settings: () => SettingsScreen,
  availability: () => AvailabilityScreen,
  rootNavigation: () => RootNavigation,
  addFriends: () => AddFriendsScreen
}));
