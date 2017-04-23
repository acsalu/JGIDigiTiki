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
import { Col, Row, Grid } from "react-native-easy-grid";

import Orientation from 'react-native-orientation';
import realm from '../../models/realm';
import sharedStyles from '../SharedStyles';
import strings from '../../data/strings';
import Util from '../util';

class SummaryScreenTableCell extends Component {
  render() {
    return (
      <View style={styles.cell}></View>
    );
  }
}

export default class SummaryScreenTable extends Component {

  createChimpCol(chimpId, i, rows, isFocalChimp) {
    const cells = ([...Array(rows||0)])
        .map((v, i) => (<SummaryScreenTableCell />));

    let titleStyles = [styles.chimpColTitle];
    if (isFocalChimp) {
      titleStyles.push(sharedStyles.btnPrimary);
    }

    return (
        <View style={styles.chimpCol} key={i}>
          <View style={titleStyles}>
            <Text style={styles.chimpColTitleText}>{chimpId}</Text>
          </View>
          {cells}
        </View>
    );
  }

  createTimeRow(dbTime, i, onTimeSelected) {
    return (
        <TouchableHighlight key={i}
          onPress={()=>{
            onTimeSelected(dbTime);
          }}
        >
          <Text>{Util.dbTime2UserTime(dbTime)}</Text>
        </TouchableHighlight>
    );
  }

  render() {

    console.log(this.props.followStartTime, );
    console.log(this.props.followEndTime, );

    const startTimeIndex = this.props.times.indexOf(this.props.followStartTime);
    const endTimeIndex = this.props.times.indexOf(this.props.followEndTime);
    const timeCol = this.props.times.slice(startTimeIndex, endTimeIndex + 2)
        .map((t, i) => this.createTimeRow(t, i, this.props.onFollowTimeSelected));

    const intervals = endTimeIndex - startTimeIndex + 1;
    const maleChimpCols = this.props.chimps.filter((c) => c.sex == 'M')
                  .map((c, i) => this.createChimpCol(c.name, i, intervals, c.name === this.props.focalChimpId));

    const femaleChimpCols = this.props.chimps.filter((c) => c.sex == 'F')
        .map((c, i) => this.createChimpCol(c.name, i, intervals, c.name === this.props.focalChimpId));

    return(
        <View style={styles.container}>
          <View style={styles.timeGroups}>
            {timeCol}
          </View>
          <View style={styles.chimpColGroup}>
            {maleChimpCols}
          </View>
          <View>
            <Text>Food</Text>
          </View>
          <View style={styles.chimpColGroup}>
            {femaleChimpCols}
          </View>
          <View>
            <Text>Species</Text>
          </View>
          <View style={styles.timeGroups}>
            {timeCol}
          </View>
        </View>
    );
  }
}

const styles = {
  container: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    paddingTop: 10
  },
  chimpColTitle: {
    borderBottomWidth: 1,
    height: 30
  },
  chimpColTitleText: {
    fontSize: 8,
    transform: [{ rotate: '90deg'}],
    textAlign: 'center',
    padding: 0,
  },
  chimpColGroup: {
    flexDirection: 'row',
    borderWidth: 1,
  },
  chimpCol: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    width: 15,
  },
  cell: {
    height: 20,
    borderWidth: 0.5,
  },
  timeGroups: {
    paddingTop: 22,
    width: 40
  }
}