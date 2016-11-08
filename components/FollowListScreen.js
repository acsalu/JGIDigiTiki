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
import Button from 'react-native-button';
import Realm from 'realm';
import Follow from '../models/Follow';

export default class FollowListScreen extends Component {

  render() {
    const realm = new Realm({schema: [Follow]});
    const follows = realm.objects(Follow.className);
    const rows = follows.map((f, i) => {
      return (
        <FollowListRow key={i}
          onPress={() => {
            this.props.navigator.push({
                id: 'FollowScreen',
                follow: f
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

    const year = date.getYear() + 1900;
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const dateString = month + '/' + day + '/' + year;

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
    borderBottomColor: '#33b5e5'
  },
  followRowInnerWrap: {
    height: 50,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  followRowTextBlock: {
    width: 200
  },
  followRowMainText: {
    fontSize: 18,
    color: 'black'
  },
  followRowArrow: {
    marginTop: 20
  }

};