import React, { Component } from 'react';
import {
  Dimensions,
  ListView,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';

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
    const focalMarker = this.props.isFocal ? "*" : "";
    return (
      <TouchableHighlight onPress={() => {
       console.log(this.props.chimp.name + " clicked");
       this.props.onPress();
      }}
        style={{backgroundColor: 'red'}}>
        <Text>{this.props.chimp.name} [{this.props.chimp.sex}] {focalMarker}</Text>
      </TouchableHighlight>
    )
  }
}

class FollowArrivalTableInfoPanelButton extends Component {
  render() {
    return (
        <TouchableHighlight style={{width: 50, height: 50}}>
          <Image style={{width: 30, height: 30}} source={infoButtonImages[this.props.name]} />
        </TouchableHighlight>
    )
  }
}

class FollowArrivalTableInfoPanel extends Component {
  render() {
    const infoPanelButtons = ['time-empty', 'time-arrive-first', 'time-arrive-second', 'time-arrive-third',
      'time-depart-first', 'time-depart-second', 'time-depart-third', 'time-continues']
        .map((n, i) => (<FollowArrivalTableInfoPanelButton key={n} name={n} />));
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

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 != r2
    });


    this.state = {
      isInfoPanelHidden: true
    };
  }

  onRowPressed = () => {
    console.log("Row Pressed!")
    this.setState({isInfoPanelHidden: false});
  }

  createChimpRow = (c, i) => {
    //return chimps.map((c, i) => (<FollowArrivalTableRow
    //    onPress={this.onRowPressed}
    //    key={c.name} chimp={c}
    //    isFocal={c.name === focalChimpId}
    //    style={{marginTop: 10, width: 100}}
    ///>));
    return (
      <Text
          style={styles.item}
          key={c.name}
      >
        {c.name + (this.props.focalChimpId === c.name ? '*' : '')}
      </Text>
    );
  }

  render() {

    const femaleChimps = this.props.chimps.filter((c) => c.sex === 'F');
    const maleChimps = this.props.chimps.filter((c) => c.sex === 'M');

    const femaleChimpRows = femaleChimps.map(this.createChimpRow);
    const maleChimpRows = maleChimps.map(this.createChimpRow);


    return (
        <View>
          <FollowArrivalTableInfoPanel style={[
           {height: 150, marginBottom: 80}
          ]}/>
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
    fontSize: 16,
    width: (Dimensions.get('window').width - 20) / 2,
    padding: 3,
    flex: 1
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
  }
});