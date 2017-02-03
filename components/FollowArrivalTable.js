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

const infoButtonImages = {
  'absent': require('../img/time-empty.png'),
  'arriveFirst': require('../img/time-arrive-first.png'),
  'arriveSecond': require('../img/time-arrive-second.png'),
  'arriveThird': require('../img/time-arrive-third.png'),
  'departFirst': require('../img/time-depart-first.png'),
  'departSecond': require('../img/time-depart-second.png'),
  'departThird': require('../img/time-depart-third.png'),
  'continuing': require('../img/time-full.png'),
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
      arrival: this.props.followArrivals
    };

    this.panels = {};
    this.panels[PanelType.time] = ['empty', 'arriveFirst', 'arriveSecond', 'arriveThird',
      'departFirst', 'departSecond', 'departThird', 'continuing'].map(this.createInfoPanelButton);

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
            onValueChange={(v) => {this.props.updateArrival('certainty', v);}}
        />);
    this.panels[PanelType.estrus] =
        (<Panel
            title={"Uvimbe:"}
            options={estrusOptions}
            values={estrusValues}
            onValueChange={(v) => {this.props.updateArrival('estrus', v)}}
        />);
    this.panels[PanelType.isWithIn5m] =
        (<Panel
            title={"Ndani ya 5m:"}
            options={['✗', '✓']}
            values={[false, true]}
            onValueChange={(v) => {this.props.updateArrival('isWithin5m', v)}}
        />);
    this.panels[PanelType.isNearestNeighbor] =
        (<Panel
            title={"Jirani wa karibu:"}
            options={['N', 'Y']}
            values={[false, true]}
            onValueChange={(v) => {this.props.updateArrival('isNearestNeighbor', v)}}
        />);

  }

  _onPanelButtonPress = (time) => {
    const selectedChimp = this.props.selectedChimp;
    if (selectedChimp !== null) {
      if (!(selectedChimp in this.props.followArrivals)) {
        if (time !== 'absent') { this.props.createNewArrival(selectedChimp, time); }
      } else {
        this.props.updateArrival('time', time)
      }
    }
  }

  _onRowPress = (c) => {
    this.props.onSelectChimp(c.name);
  }

  createInfoPanelButton = (n, i) => {
    return (
      <TouchableOpacity
          key={n}
          style={{width: 50, height: 50, paddingTop: 5, paddingLeft: 5, marginLeft: 7, marginRight: 7}}
          onPress={() => {
            this._onPanelButtonPress(n)}
          }
      >
        <Image style={{width: 40, height: 40}} source={infoButtonImages[n]} />
      </TouchableOpacity>
    );
  }

  createChimpRow = (c, i) => {
    const isSelected = c.name === this.props.selectedChimp;
    const isFocal = c.name === this.props.focalChimpId;
    const chimpButtonStyles = isSelected ? chimpButtonStylesSelected : (isFocal ? chimpButtonStylesFocal : chimpButtonStylesNonFocal);

    const hasFollowed = c.name in this.state.arrival;
    if (!hasFollowed) {
      return (
          <TouchableOpacity
              key={c.name}
              onPress={()=> {
                this._onRowPress(c);
                this.setState({panelType: PanelType.time});
              }}
              style={{marginBottom: 10}}
          >
            <View style={styles.item}>
              <Button style={chimpButtonStyles} onPress={()=> {
                this._onRowPress(c);
                this.setState({panelType: PanelType.time});
              }}>{c.name}</Button>
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

            <Image source={infoButtonImages[followArrival.time]} />

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
            }}>{followArrival.isWithin5m ? "✓" : "✗"}</Button>

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

    return (
        <View>
          <View
              style={styles.infoPanel}>
              {this.panels[this.state.panelType]}
          </View>
          <ScrollView
              style={{paddingLeft: 10, paddingRight: 10, paddingBottom: 300}}
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
    paddingBottom: 300
  },
  infoPanel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    marginBottom: 10,
    borderWidth: 1,
    paddingTop: 10,
    paddingBottom: 10,
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
  }
});

var chimpButtonStylesNonFocal = styles.followArrivalTableBtn;
var chimpButtonStylesFocal = [styles.followArrivalTableBtn, styles.followArrivalTableBtnFocal];
var chimpButtonStylesSelected = [styles.followArrivalTableBtn, styles.followArrivalTableBtnSelected];