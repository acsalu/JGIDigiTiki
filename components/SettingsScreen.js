import React, {Component} from 'react';
import {
  BackAndroid,
  Text,
  View
} from 'react-native';

export default class SettingsScreen extends Component {

  render() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
        this.props.navigator.pop();
        return true;
      }
      return false;
    });

    return(
     <View>
       <Text>Settings</Text>
     </View>
    );
  }
}