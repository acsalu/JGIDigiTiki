import React, { Component } from 'react';
import {
    AppRegistry,
    Image,
    StyleSheet,
    TouchableHighlight,
    Text,
    TextInput,
    Navigator,
    View
} from 'react-native';
import realm from '../models/realm';
import Util from './util';

export default class FollowListScreen extends Component {

  render() {
    const follows = realm.objects('Follow');
    const rows = follows.map((f, i) => {
      // TODO: Show arrivals
      return (
        <FollowListRow key={i}
          onPress={() => {
            this.props.navigator.push({
                id: 'FollowScreen',
                follow: f,
                followTime: f.FOL_time_begin,
              });
          }}
          follow={f}
        >
        </FollowListRow>);
    });

    return(
      <View style={styles.container}>
        {rows}
      </View>
    );
  }
}

class FollowListRow extends Component {
  render() {
    const follow = this.props.follow;
    const focalChimpId = follow.FOL_B_AnimID;
    const date = this.props.follow.FOL_date;
    const beginTime = this.props.follow.FOL_time_begin;

    const dateString = Util.getDateString(date);

    return(
        <TouchableHighlight
            style={styles.followRow}
            onPress={this.props.onPress}
        >
          <View style={styles.followRowInnerWrap}>
            <View style={styles.followRowTextBlock}>
              <Text style={styles.followRowMainText}>{dateString} {beginTime}</Text>
              <Text style={styles.followRowDescriptionText}>Focal: {focalChimpId}</Text>
            </View>
            <Image style={styles.followRowArrow} source={require('../img/right-arrow.png')} />
          </View>
        </TouchableHighlight>
    );
  }
}

var styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor:'white',
    alignItems: 'center'
  },
  followRow: {
    alignSelf: 'stretch',
    marginLeft: 8,
    marginRight: 8,
    paddingTop: 8,
    paddingBottom: 20,
    borderBottomWidth: 8,
    borderBottomColor: '#33b5e5',
    height: 100
  },
  followRowInnerWrap: {
    height: 60,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  followRowTextBlock: {
    width: 200
  },
  followRowMainText: {
    fontSize: 20,
    color: 'black'
  },
  followRowDescriptionText: {
    fontSize: 16
  },
  followRowArrow: {
    marginTop: 20
  }

};