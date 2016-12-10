import React, { Component } from 'react';
import {
  AppRegistry,
  DatePickerAndroid,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  Modal,
  Navigator,
  Picker,
  View
} from 'react-native';
import Button from 'react-native-button';
import ItemTracker from '../ItemTracker';
import util from '../util';

export default class FollowScreenHeader extends Component {
  render() {
    const isFirstFollow = this.props.followTime === this.props.follow.FOL_time_begin;

    return (
        <View style={styles.followScreenHeader}>
          <View style={styles.followScreenHeaderInfoRow}>
            <Button
                style={[{opacity: (isFirstFollow ? 0.0 : 1.0)}, styles.btn]}
                onPress={this.props.onPreviousPress}
                disabled={isFirstFollow}
            >
              Iliyopita
            </Button>
            <Text style={styles.followScreenHeaderMainText}>
              {util.dbTime2UserTime(this.props.followTime)}
            </Text>
            <Button
                style={styles.btn}
                onPress={this.props.onNextPress}
            >
              Inayofuata
            </Button>
          </View>
          <ItemTracker
              title='Food'
              activeListTitle='Active'
              finishedListTitle='Finished'
              activeItems={this.props.activeFood}
              finishedItems={this.props.finishedFood}
              onTrigger={this.props.onFoodTrackerSelected}
              onSelectActiveItem={this.props.onSelectActiveFood}
              onSelectFinishedItem={this.props.onSelectFinishedFood}
          />
          <ItemTracker
              title='Species'
              activeListTitle='Active'
              finishedListTitle='Finished'
              activeItems={this.props.activeSpecies}
              finishedItems={this.props.finishedSpecies}
              onTrigger={this.props.onSpeciesTrackerSelected}
              onSelectActiveItem={this.props.onSelectActiveSpecies}
              onSelectFinishedItem={this.props.onSelectFinishedSpecies}
          />
        </View>
    );
  }
}

const styles = {
  followScreenHeader: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 150,
    paddingLeft: 12,
    paddingRight: 12
  },
  followScreenHeaderInfoRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    alignItems: 'center',
    height: 40,
    paddingLeft: 12,
    paddingRight: 12
  },
  headerRow: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    alignItems: 'center',
    height: 50,
  },
  followScreenHeaderMainText: {
    fontSize: 34,
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
  btnInGroup: {
    marginRight: 8
  }
};