import React, { Component } from 'react';
import {
  Button,
  Image,
  TouchableHighlight,
  Text,
  View
} from 'react-native';
import Orientation from 'react-native-orientation';
import deviceLog, {LogView, InMemoryAdapter} from 'react-native-device-log';

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

    const strings = this.props.screenProps.localizedStrings; // default = "en"

    return(
      <Image source={require('../../img/chimp.png')} style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>Jane Goodall Institute</Text>
          <TouchableHighlight
            onPress={() => {this.props.navigation.navigate('SettingsScreen');}}>
            <View style={styles.settingsButtonWrapper}>
              <Image source={require('../../img/settings.png')}></Image>
            </View>
          </TouchableHighlight>
        </View>


        <Text style={styles.description}>{strings.Menu_Title}</Text>

        <Button
            onPress={() => {this.props.navigation.navigate('NewFollowScreen');}}
            style={[sharedStyles.btn, styles.menuBtn]} title={strings.Menu_NewFollow}
        >

        </Button>

        <Button
            onPress={() => {this.props.navigation.navigate('FollowListScreen');}}
            style={[sharedStyles.btn, styles.menuBtn]} title={strings.Menu_ContinueFollow}
        >

        </Button>

        <Button
            onPress={() => {this.props.navigation.navigate('ExportDataScreen');}}
            style={[sharedStyles.btn, styles.menuBtn]} title={strings.Menu_ExportData}>

        </Button>

        <Text>Version: 0.3.2</Text>

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
