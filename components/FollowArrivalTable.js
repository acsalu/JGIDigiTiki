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
import Util from './util';
import realm from '../models/realm';

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


const PanelType = Object.freeze({'time': 1, 'certainty': 2, 'estrus': 3, 'isWithIn5m': 4, 'isNearestNeighbor': 5});

class Panel extends Component {
  render() {
    const optionButtons = this.props.options.map((o, i) => {
      return (<Button
          key={o}
          onPress={()=> {
            this.props.onValueChange(this.props.values[i]);
          }}
          style={styles.panelOptionButton}
      >
        {o}
      </Button>);
    });
    return (
        <View style={{flexDirection: 'row'}}>
          <Text>{this.props.title}</Text>
          {optionButtons}
        </View>
    );
  }
}


export default class FollowArrivalTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedChimp: null,
      panelType: PanelType.time,
      arrival: {}
    };

    this.panels = {};
    this.panels[PanelType.time] = ['time-empty', 'time-arrive-first', 'time-arrive-second', 'time-arrive-third',
      'time-depart-first', 'time-depart-second', 'time-depart-third', 'time-continues'].map(this.createInfoPanelButton);

    const certaintyOrder = ['certain', 'uncertain', 'nestCertain', 'nestUncertain'];
    const certaintyOptions = certaintyOrder.map((c, i) => Util.certaintyLabelsUser[c]);
    const certaintyValues = certaintyOrder.map((c, i) => Util.certaintyLabels[c]);

    const estrusOrder = ['a', 'b', 'c', 'd', 'e'];
    const estrusOptions = estrusOrder.map((e, i) => Util.estrusLabelsUser[e]);
    const estrusValues = estrusOrder.map((e, i) => Util.estrusLabels[e]);

    this.panels[PanelType.certainty] =
        (<Panel
            title={"Certainty:"}
            options={certaintyOptions}
            values={certaintyValues}
            onValueChange={(v) => {this._updateSelectedArrival('certainty', v);}}
        />);
    this.panels[PanelType.estrus] =
        (<Panel
            title={"Uvimbe:"}
            options={estrusOptions}
            values={estrusValues}
            onValueChange={(v) => {this._updateSelectedArrival('estrus', v)}}
        />);
    this.panels[PanelType.isWithIn5m] =
        (<Panel
            title={"Ndani ya 5m:"}
            options={['✗', '✓']}
            values={[false, true]}
            onValueChange={(v) => {this._updateSelectedArrival('isWithIn5m', v)}}
        />);
    this.panels[PanelType.isNearestNeighbor] =
        (<Panel
            title={"Jirani wa karibu:"}
            options={['N', 'Y']}
            values={[false, true]}
            onValueChange={(v) => {this._updateSelectedArrival('isNearestNeighbor', v)}}
        />);

  }

  _updateArrival(chimpId, field, newValue) {
    let newArrival = this.state.arrival;
    newArrival[chimpId][field] = newValue;
    this.setState(newArrival);
    realm.write(() => {
      const fa = this.state.arrival[chimpId];

      const newFollowArrival = realm.create('FollowArrival', {
        FA_FOL_date: this.props.followDate,
        FA_FOL_B_focal_AnimID: this.props.focalChimpId,
        FA_B_arr_AnimID: chimpId,
        FA_type_of_certainty: parseInt(fa.certainty),
        FA_type_of_cycle: parseInt(fa.estrus),
        FA_closest_to_focal: fa.isNearestNeighbor,
        FA_within_five_meters: fa.isWithIn5m
      });
    });

    console.log(realm.objects('FollowArrival').length, " FollowArrivals in DB.");
    console.log(this.state.arrival);
  }

  _updateSelectedArrival(field, newValue) {
    if (this.state.selectedChimp !== null) {
      this._updateArrival(this.state.selectedChimp, field, newValue);
    }
  }

  _createDefultFollowArrival(time) {
    return {
      time: time,
      certainty: Util.certaintyLabels.certain,
      estrus: Util.estrusLabels.a,
      isWithIn5m: false,
      isNearestNeighbor: false
    }
  }

  _onPanelButtonPress = (b) => {
    const selectedChimp = this.state.selectedChimp;
    if (selectedChimp !== null) {
      let newArrival = this.state.arrival;
      if (!(selectedChimp in newArrival)) {
        if (b !== 'time-empty') { newArrival[selectedChimp] = this._createDefultFollowArrival(b); }
      } else {
        if (b !== 'time-empty') {
          newArrival[selectedChimp]['time'] = b;
        } else {
          delete newArrival[selectedChimp];
        }
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
              style={{marginBottom: 10}}
          >
            <View style={styles.item}>
              <Button style={chimpButtonStyles} onPress={()=> {this._onRowPress(c)}}>{c.name}</Button>
            </View>
          </TouchableOpacity>
      );
    }

    const followArrival = this.state.arrival[c.name];
    const certaintyLabel = Util.certaintyLabelsDb2UserMap[followArrival.certainty];
    const estrusLabel = Util.estrusLabelsDb2UserMap[followArrival.estrus];
    return (
        <TouchableOpacity
            key={c.name}
            style={{marginBottom: 10}}
            onPress={()=> {
              this._onRowPress(c)
              this.setState({panelType: PanelType.time});
            }}
        >
          <View style={styles.item}>
            <Button style={chimpButtonStyles} onPress={()=> {
              this._onRowPress(c)
              this.setState({panelType: PanelType.time});
            }}>{c.name}</Button>

            <Image source={infoButtonImages[followArrival['time']]} />

            <Button style={[styles.followArrivalTableBtn]} onPress={()=> {
              this._onRowPress(c)
              this.setState({panelType: PanelType.certainty});
            }}>{certaintyLabel}</Button>

            <Button style={[styles.followArrivalTableBtn]} onPress={()=> {
              this._onRowPress(c)
              this.setState({panelType: PanelType.estrus});
            }}>{estrusLabel}</Button>

            <Button style={[styles.followArrivalTableBtn]} onPress={()=> {
              this._onRowPress(c)
              this.setState({panelType: PanelType.isWithIn5m});
            }}>{followArrival.isWithIn5m ? "✓" : "✗"}</Button>

            <Button style={[styles.followArrivalTableBtn]} onPress={()=> {
              this._onRowPress(c)
              this.setState({panelType: PanelType.isNearestNeighbor});
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

    let panelContent = this.panels[this.state.panelType];

    return (
        <View>
          <View
              style={styles.infoPanel}>
              {panelContent}
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
  infoPanel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginBottom: 10,
    borderWidth: 1,
    paddingTop: 20,
    marginLeft: 10,
    marginRight: 10
  },
  item: {
    width: (Dimensions.get('window').width - 20) / 2,
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
    width: 50,
    backgroundColor: '#ececec',
    color: 'black',
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 3,
    paddingRight: 3,
    marginLeft: 2,
    marginRight: 2,
    borderColor: '#ddd',
    borderWidth: 1,
    flex: 1,
    fontSize: 14,
  },
  followArrivalTableBtnFocal: {
    backgroundColor: '#33b5e5',
  },
  followArrivalTableBtnSelected: {
    backgroundColor: '#9c0',
  },
  panelOptionButton: {
    width: 40,
    backgroundColor: '#ececec',
    color: 'black',
    fontSize: 14,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 2,
    marginRight: 2,
    borderColor: '#ddd',
    borderWidth: 1,
  }
});

var chimpButtonStylesNonFocal = styles.followArrivalTableBtn;
var chimpButtonStylesFocal = [styles.followArrivalTableBtn, styles.followArrivalTableBtnFocal];
var chimpButtonStylesSelected = [styles.followArrivalTableBtn, styles.followArrivalTableBtnSelected];

/*
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
*/