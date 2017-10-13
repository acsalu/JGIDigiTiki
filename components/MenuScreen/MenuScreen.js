import React, { Component } from 'react';
import {
  Button,
  Image,
  TouchableHighlight,
  Text,
  View
} from 'react-native';
import Orientation from 'react-native-orientation';

import sharedStyles from '../SharedStyles';

export default class MenuScreen extends Component {

  _orientationDidChange(orientation) {
    console.log("_orientationDidChange", orientation);
    if (orientation == 'LANDSCAPE') {
      //do something with landscape layout
    } else {
      //do something with portrait layout
    }
  }

  componentDidMount() {
    Orientation.lockToPortrait();
    Orientation.addOrientationListener(this._orientationDidChange);
  }

  render() {
    //const strings = this.props.strings;
    const strings = this.props.screenProps.enStrings;

    console.log(this.props.screenProps.language);
    // if(this.props.language == "en") {
    //   const strings = this.props.enStrings;
    // } elif (this.props.language == "sw") {
    //   const strings = this.props.swStrings;
    // }
    console.log(strings);

    return(
      <Image source={require('../../img/chimp.png')} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Jane Goodall Institute</Text>
          <TouchableHighlight
            onPress={() => {this.props.navigator.push({id: 'SettingsScreen'});}}>
            <View style={styles.settingsButtonWrapper}>
              <Image source={require('../../img/settings.png')}></Image>
            </View>
          </TouchableHighlight>
        </View>


        <Text style={styles.description}>{strings.Menu_Title}</Text>

        <Button
            onPress={() => {this.props.navigator.push({id: 'NewFollowScreen'});}}
            style={[sharedStyles.btn, styles.menuBtn]} title={strings.Menu_NewFollow}
        >

        </Button>

        <Button
            onPress={() => {this.props.navigator.push({id: 'FollowListScreen'});}}
            style={[sharedStyles.btn, styles.menuBtn]} title={strings.Menu_ContinueFollow}
        >

        </Button>

        <Button
            onPress={() => {this.props.navigator.push({id: 'ExportDataScreen'});}}
            style={[sharedStyles.btn, styles.menuBtn]} title={strings.Menu_ExportData}>

        </Button>

      </Image>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor:'white',
    alignItems: 'center',
    resizeMode: Image.resizeMode.contain
  },
  header: {
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ececec',
  },
  headerText: {
    textAlign: 'left',
    fontSize: 18,
    color: 'black',
  },
  settingsButtonWrapper: {
    flexDirection: 'row',
  },
  description: {
    alignSelf: 'stretch',
    marginTop: 100,
    marginBottom: 30,
    fontSize: 44,
    textAlign: 'center',
    lineHeight: 40,
    color: 'black'
  },
  menuBtn: {
    width: 500,
    marginTop: 20,
    marginBottom: 20
  }
};
