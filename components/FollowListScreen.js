import React, { Component } from 'react';
import {
    AppRegistry,
    DatePickerAndroid,
    Picker,
    StyleSheet,
    TouchableHighlight,
    Text,
    TextInput,
    Navigator,
    View
} from 'react-native';
import Button from 'react-native-button';
import Realm from 'realm';
import Follow from '../models/Follow';

export default class FollowListScreen extends Component {

  render() {
    const realm = new Realm({schema: [Follow]});
    const follows = realm.objects(Follow.className);
    console.log(follows.length + ' follows');
    const followTexts = follows.map((f) => {
      return (<Text key="">{f.FOL_CL_community_id} {f.FOL_B_AnimID} {f.FOL_am_observer1}</Text>)
    });

    return(
      <View>
        {followTexts}
      </View>
    );
  }
}