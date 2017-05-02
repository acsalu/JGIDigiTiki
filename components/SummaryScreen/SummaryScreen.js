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
import Orientation from 'react-native-orientation';

import realm from '../../models/realm';
import sharedStyles from '../SharedStyles';
import strings from '../../data/strings';
import SummaryScreenHeader from './SummaryScreenHeader';
import SummaryScreenTable from './SummaryScreenTable';
import assert from 'assert';


export default class SummaryScreen extends Component {

  componentDidMount() {
    Orientation.lockToLandscapeLeft();
  }

  render() {

    const followArrivals = realm.objects('FollowArrival')
        .filtered('focalId = $0 AND date = $1', this.props.follow.FOL_B_AnimID, this.props.follow.FOL_date);

    let followStartTimes = [this.props.follow.FOL_time_begin];
    followStartTimes = followStartTimes.concat(followArrivals.map((fa, i) => fa.followStartTime));
    followStartTimes.sort();
    const lastFollowStartTime = followStartTimes.length === 0 ? this.props.follow.FOL_time_begin : followStartTimes.pop();

    const followStartTime = this.props.follow.FOL_time_begin;
    const followDate = this.props.follow.FOL_date;

    let followArrivalSummary = {};
    for (let i = 0; i < this.props.chimps.length; ++i) {
      const c = this.props.chimps[i];
      followArrivalSummary[c.name] = [];
    }

    for (var i = 0; i < followArrivals.length; ++i) {
      const fa = followArrivals[i];
      assert(fa.chimpId in followArrivalSummary);
      followArrivalSummary[fa.chimpId].push(fa);
    }


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
              this.props.navigator.replace({
                id: 'FollowScreen',
                follow: this.props.follow,
                followTime: t,
              });
            }}
            followArrivalSummary={followArrivalSummary}
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