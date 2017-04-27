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
import assert from 'assert';
import Button from 'react-native-button';
import { Col, Row, Grid } from "react-native-easy-grid";

import Orientation from 'react-native-orientation';
import realm from '../../models/realm';
import sharedStyles from '../SharedStyles';
import strings from '../../data/strings';
import Util from '../util';

class SummaryScreenTableCell extends Component {

  render() {
    let cellStyles = [styles.cell];
    if (this.props.shouldHighlight) {
      cellStyles.push(styles.cellHighlight);
    }
    return (
      <View style={cellStyles}></View>
    );
  }
}

class SummaryScreenTableChimpCol extends Component {
  onLayout(event) {
    var {x, y, width, height} = event.nativeEvent.layout;
    console.log(x, y, width, height);
  }

  render() {
    const cells = ([...Array(this.props.rows||0)])
        .map((v, i) => {
            return (<SummaryScreenTableCell key={i} shouldHighlight={this.props.timeIndices.indexOf(i) !== -1} />)
        });

    let titleStyles = [styles.chimpColTitle];
    if (this.props.isFocalChimp) {
      titleStyles.push(sharedStyles.btnPrimary);
    } else if (this.props.isSwelled) {
      titleStyles.push(styles.chimpColTitleSwelled);
    }

    return (
        <View style={styles.chimpCol}>
          <View style={titleStyles}>
            <Text style={styles.chimpColTitleText}>{this.props.chimpId}</Text>
          </View>
          {cells}
        </View>
    );
  }

}

export default class SummaryScreenTable extends Component {

  createChimpCol(chimpId, i, rows, isFocalChimp, isSwelled) {

    assert(chimpId in this.props.followArrivalSummary);
    const timeIndices = this.props.followArrivalSummary[chimpId]
        .map((t, i) => this.props.times.indexOf(t) - this.props.times.indexOf(this.props.followStartTime));

    return (
      <SummaryScreenTableChimpCol
          key={i}
          chimpId={chimpId}
          rows={rows}
          isFocalChimp={isFocalChimp}
          isSwelled={isSwelled}
          timeIndices={timeIndices}
        />
    );
  }

  createItemCol(title, rows) {
    const cells = ([...Array(rows||0)])
        .map((v, i) => (<SummaryScreenTableCell key={i} />));
    return (
        <View style={styles.itemCol}>
          <View style={styles.chimpColTitle}>
            <Text style={styles.itemColTitleText}>{title}</Text>
          </View>
          {cells}
        </View>
    );
  }

  createTimeRow(dbTime, i, onTimeSelected) {
    return (
        <TouchableHighlight
            key={i}
            style={styles.timeRow}
            onPress={()=>{
              onTimeSelected(dbTime);
            }}
        >
          <Text style={styles.timeRowText}>{Util.dbTime2UserTime(dbTime)}</Text>
        </TouchableHighlight>
    );
  }

  render() {

    console.log(this.props.followArrivalSummary);

    const startTimeIndex = this.props.times.indexOf(this.props.followStartTime);
    const endTimeIndex = this.props.times.indexOf(this.props.followEndTime);
    const timeCol = this.props.times.slice(startTimeIndex, endTimeIndex + 2)
        .map((t, i) => this.createTimeRow(t, i, this.props.onFollowTimeSelected));

    const intervals = endTimeIndex - startTimeIndex + 1;
    const maleChimpCols = this.props.chimps.filter((c) => c.sex == 'M')
                  .map((c, i) => this.createChimpCol(c.name, i, intervals, c.name === this.props.focalChimpId, false));

    const femaleChimpCols = this.props.chimps.filter((c) => c.sex == 'F')
        .map((c, i) => this.createChimpCol(c.name, i, intervals, c.name === this.props.focalChimpId, this.props.swelledChimps.has(c.name)));
    const foodCol = this.createItemCol("Food", intervals);
    const speciesCol = this.createItemCol("Species", intervals);

    return(
        <View style={styles.container}>
          <View style={styles.timeGroups}>
            {timeCol}
          </View>
          <View style={styles.colGroup}>
            {maleChimpCols}
          </View>
          <View style={styles.colGroup}>
            {foodCol}
          </View>
          <View style={styles.colGroup}>
            {femaleChimpCols}
          </View>
          <View style={styles.colGroup}>
            {speciesCol}
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
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
    borderWidth: 0.5,
  },
  chimpColTitleText: {
    transform: [{ rotate: '90deg'}],
    width: 23,
    fontSize: 8,
    fontWeight: 'bold',
    color: 'black'
  },
  colGroup: {
    flexDirection: 'row',

  },
  chimpCol: {
    alignSelf: 'stretch',
    flexDirection: 'column',
    width: 15,
  },
  itemCol: {
    width: 45,
  },
  itemColTitleText: {
    fontSize: 10,
    textAlign: 'center',
  },
  timeRow: {
    marginBottom: 3,
  },
  timeRowText: {
    fontSize: 12,
    textAlign: 'center'
  },
  cell: {
    height: 20,
    borderWidth: 0.5,
  },
  cellHighlight: {
    backgroundColor: 'grey'
  },
  timeGroups: {
    paddingTop: 32,
    width: 40
  },
  chimpColTitleSwelled: {
    backgroundColor: '#F48FB1',
  }
}