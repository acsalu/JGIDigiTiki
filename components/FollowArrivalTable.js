import React, { Component } from 'react';
import {
  Dimensions,
  ListView,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View
} from 'react-native';
import Button from 'react-native-button';

const infoButtonImages = {
  'time-empty': require('../img/time-empty.png'),
  'time-arrive-first': require('../img/time-arrive-first.png'),
  'time-arrive-second': require('../img/time-arrive-second.png'),
  'time-arrive-third': require('../img/time-arrive-third.png'),
  'time-depart-first': require('../img/time-depart-first.png'),
  'time-depart-second': require('../img/time-depart-second.png'),
  'time-depart-third': require('../img/time-depart-third.png'),
  'time-continues': require('../img/time-continues.png'),
};

class FollowArrivalTableRow extends Component {
  render() {
    const chimp = this.props.chimp;
    const chimpButtonStyles = this.props.isSelected ? chimpButtonStylesSelected : (this.props.isFocal ? chimpButtonStylesFocal : chimpButtonStylesNonFocal);
    return (
      <TouchableOpacity
          onPress={this.props.onPress}
      >
        <View style={styles.item}>
            <Button style={chimpButtonStyles} onPress={this.props.onPress}>{chimp.name}</Button>
            <Image />
            <Button style={styles.followArrivalTableBtn} onPress={this.props.onPress}>.</Button>
            <Button style={styles.followArrivalTableBtn} onPress={this.props.onPress}>.00</Button>
            <Button style={styles.followArrivalTableBtn} onPress={this.props.onPress}>X</Button>
            <Button style={styles.followArrivalTableBtn} onPress={this.props.onPress}>N</Button>
        </View>
      </TouchableOpacity>
    )
  }
}

class FollowArrivalTableInfoPanelButton extends Component {
  render() {
    return (
        <TouchableOpacity
            style={{width: 50, height: 50}}
            onPress={this.props.onPress(this.props.name)}
        >
          <Image style={{width: 30, height: 30}} source={infoButtonImages[this.props.name]} />
        </TouchableOpacity>
    )
  }
}

class FollowArrivalTableInfoPanel extends Component {
  render() {
    const infoPanelButtons = ['time-empty', 'time-arrive-first', 'time-arrive-second', 'time-arrive-third',
      'time-depart-first', 'time-depart-second', 'time-depart-third', 'time-continues']
        .map((n, i) => (<FollowArrivalTableInfoPanelButton key={n} name={n} onPress={this.props.onPanelButtonPress} />));
    return (
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 80}}>
          {infoPanelButtons}
        </View>
    )

  }
}

export default class FollowArrivalTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedChimp: null,
      arrival: {}
    };
  }

  _createDefultFollowArrival(time) {
    return {
      time: time,
      certainty: 0,
      estrousState: 0.0,
      isWithIn5m: false,
      isNearestNeighbor: false
    }
  }

  _onPanelButtonPress = (b) => {
    const selectedChimp = this.state.selectedChimp;
    if (selectedChimp !== null) {
      let newArrival = this.state.arrival;
      if (!(selectedChimp in newArrival)) {
        newArrival[selectedChimp] = this._createDefultFollowArrival(b);
      } else {
        newArrival[selectedChimp]['time'] = b;
      }
      this.setState({arrival: newArrival});
    }
  }

  _onRowPress = (c) => {
    this.setState({selectedChimp: c.name});
  }

  createInfoPanelButton = (n, i) => {
    return (
      <TouchableOpacity
          key={n}
          style={{width: 50, height: 50}}
          onPress={() => {this._onPanelButtonPress(n)}}
      >
        <Image style={{width: 30, height: 30}} source={infoButtonImages[n]} />
      </TouchableOpacity>
    );
  }

  createChimpRow = (c, i) => {
    const isSelected = this.state.selectedChimp === c.name;
    const isFocal = c.name === this.props.focalChimpId;
    const chimpButtonStyles = isSelected ? chimpButtonStylesSelected : (isFocal ? chimpButtonStylesFocal : chimpButtonStylesNonFocal);

    const hasRecorded = c.name in this.state.arrival;

    if (!hasRecorded) {
      return (
          <TouchableOpacity
              key={c.name}
              onPress={()=> {this._onRowPress(c)}}
          >
            <View style={styles.item}>
              <Button style={chimpButtonStyles} onPress={()=> {this._onRowPress(c)}}>{c.name}</Button>
            </View>
          </TouchableOpacity>
      );
    }

    const followArrival = this.state.arrival[c.name];
    return (
        <TouchableOpacity
            key={c.name}
            onPress={()=> {
              this._onRowPress(c)
            }}
        >
          <View style={styles.item}>
            <Button style={chimpButtonStyles} onPress={()=> {
              this._onRowPress(c)
            }}>{c.name}</Button>
            <Image source={hasRecorded ? infoButtonImages[followArrival['time']] : ""}/>
            <Button style={[styles.followArrivalTableBtn]} onPress={()=> {
              this._onRowPress(c)
            }}>{followArrival.certainty}</Button>
            <Button style={[styles.followArrivalTableBtn]} onPress={()=> {
              this._onRowPress(c)
            }}>{followArrival.estrousState}</Button>
            <Button style={[styles.followArrivalTableBtn]} onPress={()=> {
              this._onRowPress(c)
            }}>{followArrival.isWithIn5m ? "Y" : "N"}</Button>
            <Button style={[styles.followArrivalTableBtn]} onPress={()=> {
              this._onRowPress(c)
            }}>{followArrival.isNearestNeighbor ? "Y" : "N"}</Button>
          </View>
        </TouchableOpacity>
    );
  }

  render() {

    const femaleChimps = this.props.chimps.filter((c) => c.sex === 'F');
    const maleChimps = this.props.chimps.filter((c) => c.sex === 'M');

    const femaleChimpRows = femaleChimps.map(this.createChimpRow);
    const maleChimpRows = maleChimps.map(this.createChimpRow);

    const infoPanelButtons = ['time-empty', 'time-arrive-first', 'time-arrive-second', 'time-arrive-third',
      'time-depart-first', 'time-depart-second', 'time-depart-third', 'time-continues'].map(this.createInfoPanelButton);

    return (
        <View>
          <View
              style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', height: 50, marginBottom: 80}}>
              {infoPanelButtons}
          </View>
          <ScrollView
              style={{paddingLeft: 10, paddingRight: 10}}
              contentContainerStyle={styles.list}
          >
            <View style={[styles.chimpRowGroup, styles.borderBottom]}>
              {femaleChimpRows}
            </View>
            <View style={[styles.chimpRowGroup]}>
            {maleChimpRows}
            </View>
          </ScrollView>
        </View>
    );
  }
}

var styles = StyleSheet.create({
  hidden: {
    opacity: 0.0
  },
  show: {
    opacity: 1.0
  },
  list: {

  },
  item: {
    width: (Dimensions.get('window').width - 20) / 2,
    height: 30,
    padding: 3,
    flexDirection: 'row'
  },
  borderBottom: {
    borderBottomColor: 'black',
    borderBottomWidth: 2,
  },
  chimpRowGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    flex: 1
  },
  followArrivalTableBtn: {
    width: 40,
    backgroundColor: '#ececec',
    fontSize: 14,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 2,
    marginRight: 2,
    borderColor: '#ddd',
    borderWidth: 1,
    flex: 1
  },
  followArrivalTableBtnFocal: {
    backgroundColor: '#33b5e5',
  },
  followArrivalTableBtnSelected: {
    backgroundColor: '#9c0',
  }
});

var chimpButtonStylesNonFocal = styles.followArrivalTableBtn;
var chimpButtonStylesFocal = [styles.followArrivalTableBtn, styles.followArrivalTableBtnFocal];
var chimpButtonStylesSelected = [styles.followArrivalTableBtn, styles.followArrivalTableBtnSelected];