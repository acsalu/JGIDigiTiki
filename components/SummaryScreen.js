import React, { Component } from 'react';
import {
  AppRegistry,
  BackAndroid,
  Dimensions,
  Image,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  Navigator,
  NativeModules,
  View
} from 'react-native';
import Button from 'react-native-button';

import sharedStyles from './SharedStyles';
import strings from '../data/strings';
import realm from '../models/realm';

export default class SummaryScreen extends Component {

  render() {

    const followArrivals = realm.objects('FollowArrival')
        .filtered('focalId = $0 AND date = $1', this.props.follow.FOL_B_AnimID, this.props.follow.FOL_date);
    console.log(followArrivals.length, 'followArrivals');
    for (var i = 0; i < followArrivals.length; ++i) {
      const fa = followArrivals[i];
      console.log(fa.followStartTime);
    }

    const followStartTimes = followArrivals.map((fa, i) => fa.followStartTime);
    followStartTimes.sort();
    const lastFollowStartTime = followStartTimes.pop();


    return(
        <View style={styles.container}>
          <Text>Summary Screen</Text>
          <Button
            onPress={() => {
            this.props.navigator.push({
              id: 'FollowScreen',
              follow: this.props.follow,
              followTime: lastFollowStartTime
            });
          }}>
            Continue Follow
          </Button>
        </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor:'white',
    alignItems: 'center',
    resizeMode: Image.resizeMode.contain
  },
  header: {
    alignSelf: "stretch",
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    fontSize: 18,
    textAlign: 'left',
    backgroundColor: '#ececec',
    color: 'black'
  },
  description: {
    alignSelf: 'stretch',
    marginTop: 100,
    marginBottom: 30,
    fontSize: 44,
    textAlign: 'center',
    lineHeight: 40,
    color: 'black'
  },
  menuBtn: {
    width: 500,
    marginTop: 20,
    marginBottom: 20
  }
};