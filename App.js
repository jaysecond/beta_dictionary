import React from 'react';
import { createStackNavigator } from 'react-navigation'; // Version can be specified in package.json
import OptionsScreen from './screens/OptionsScreen.js';
import TermScreen from './screens/TermScreen.js';
import HomeScreen from './screens/HomeScreen.js';

const HomeStack = createStackNavigator(
  {
    Home:  HomeScreen,
    TermScreen: TermScreen, 
    Options: OptionsScreen, 
  },
  {
    initialRouteName: 'Home',
  },
);

export default class App extends React.Component {
  render() {
    return <HomeStack />;
  }
}