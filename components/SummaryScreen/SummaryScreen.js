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
import Orientation from 'react-native-orientation';

import realm from '../../models/realm';
import sharedStyles from '../SharedStyles';
import strings from '../../data/strings';
import SummaryScreenHeader from './SummaryScreenHeader';
import SummaryScreenTable from './SummaryScreenTable';


export default class SummaryScreen extends Component {

  componentDidMount() {
    Orientation.lockToLandscapeLeft();
  }

  render() {

    const followArrivals = realm.objects('FollowArrival')
        .filtered('focalId = $0 AND date = $1', this.props.follow.FOL_B_AnimID, this.props.follow.FOL_date);
    console.log(followArrivals.length, 'followArrivals');
    for (var i = 0; i < followArrivals.length; ++i) {
      const fa = followArrivals[i];
      console.log(fa.followStartTime);
    }

    const followStartTimes = followArrivals.map((fa, i) => fa.followStartTime);
    const followEndTimes = followArrivals.map((fa, i) => fa.followEndTime);
    followStartTimes.sort();
    followEndTimes.sort();
    const lastFollowStartTime = followStartTimes.pop();

    const followStartTime = followStartTimes[0];
    const followEndTime = followEndTimes.pop();
    const followDate = this.props.follow.FOL_date;

    return(
        <View style={styles.container}>
          <SummaryScreenHeader
            focalChimpId={this.props.follow.FOL_B_AnimID}
            researcherName={this.props.follow.FOL_am_observer1}
            followDate={followDate}
            followStartTime={followStartTime}
            followEndTime={lastFollowStartTime}
          />
          <SummaryScreenTable
            focalChimpId={this.props.follow.FOL_B_AnimID}
            chimps={this.props.chimps}
            followStartTime={followStartTime}
            followEndTime={lastFollowStartTime}
            times={this.props.times}
            onFollowTimeSelected={(t) => {
              this.props.navigator.push({
                id: 'FollowScreen',
                follow: this.props.follow,
                followTime: t,
              });
            }}
          />

        </View>
    );
  }
}

const containerPaddingHorizontal = 5;
const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: containerPaddingHorizontal,
    paddingRight: containerPaddingHorizontal,
    width: undefined,
    height: undefined,
    alignItems: 'center',
  },
};