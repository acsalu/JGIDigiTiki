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
import Follow from '../models/Follow';
import FollowArrivalTable from './FollowArrivalTable';

export default class FollowScreen extends Component {

  render() {
    const beginFollowTime = this.props.follow.FOL_time_begin;
    const beginFollowTimeIndex = this.props.times.indexOf(beginFollowTime);
    const followTimeIndex = this.props.times.indexOf(this.props.followTime);
    const previousFollowTime = followTimeIndex !== beginFollowTimeIndex ? this.props.times[followTimeIndex - 1] : null;
    const nextFollowTime = followTimeIndex !== this.props.times.length - 1 ? this.props.times[followTimeIndex + 1] : null;
    return(
      <View>
        <FollowScreenHeader
            follow={this.props.follow}
            followTime={this.props.followTime}
            onPreviousPress={()=> {
              this.props.navigator.replace({
                  id: 'FollowScreen',
                  follow: this.props.follow,
                  followTime: previousFollowTime
                });
            }}
            onNextPress={()=>{
              this.props.navigator.replace({
                  id: 'FollowScreen',
                  follow: this.props.follow,
                  followTime: nextFollowTime
                });
            }}
        />
        <FollowArrivalTable
            chimps={this.props.chimps}
            focalChimpId={this.props.follow.FOL_B_AnimID}
            followDate={this.props.follow.FOL_date} />
      </View>
    );
  }
}

class FollowScreenHeader extends Component {
  render() {
    const isFirstFollow = this.props.followTime === this.props.follow.FOL_time_begin;

    return (
        <View style={styles.followScreenHeader}>
          <Button
              style={[{opacity: (isFirstFollow ? 0.0 : 1.0)}, styles.btn]}
              onPress={this.props.onPreviousPress}
              disabled={isFirstFollow}
          >
            Iliyopita
          </Button>
          <Text style={styles.followScreenHeaderMainText}>{this.props.followTime}</Text>
          <Button
              style={styles.btn}
              onPress={this.props.onNextPress}
          >
            Inayofuata
          </Button>
        </View>
    );
  }
}

const styles = {
  followScreenHeader: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
    paddingLeft: 12,
    paddingRight: 12
  },
  followScreenHeaderMainText: {
    fontSize: 20,
    color: '#000'
  },
  btn: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#33b5e5',
    borderRadius: 3
  },
};