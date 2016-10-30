import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  Navigator,
  View
} from 'react-native';
import Button from 'react-native-button';

export default class MenuScreen extends Component {

  render() {
    return(
      <View>
        <Text>Fuata</Text>

        <Button onPress={() => {this.props.navigator.push({id: 'NewFollowScreen'});}}>
          Anza ufuataji
        </Button>

        <Button onPress={() => {this.props.navigator.push({id: 'FollowListScreen'});}}>
          Endelea kufuata
        </Button>

        <Button onPress={() => {}}>
          Endelea na ufuataji ulipoachia
        </Button>

      </View>
    );
  }
}