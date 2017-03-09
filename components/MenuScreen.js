import React, { Component } from 'react';
import {
  AppRegistry,
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

import sharedStyles from './SharedStyles';
import strings from '../data/strings';

const Mailer = NativeModules.RNMail;

export default class MenuScreen extends Component {

  render() {
    return(
      <Image source={require('../img/chimp.png')} style={styles.container}>
        <Text style={styles.header}>Jane Goodall Institute</Text>
        <Text style={styles.description}>{strings.Menu_Title}</Text>

        <Button
            onPress={() => {this.props.navigator.push({id: 'NewFollowScreen'});}}
            style={[sharedStyles.btn, styles.menuBtn]}
        >
          {strings.Menu_NewFollow}
        </Button>

        <Button
            onPress={() => {this.props.navigator.push({id: 'FollowListScreen'});}}
            style={[sharedStyles.btn, styles.menuBtn]}
        >
          {strings.Menu_ContinueFollow}
        </Button>

        <Button
            onPress={() => {}}
            style={[sharedStyles.btn, styles.menuBtn]}>
          Endelea na ufuataji ulipoachia
        </Button>

        <Button
            onPress={() => {
              Mailer.mail({
                subject: 'need help',
                recipients: ['support@example.com'],
                ccRecipients: ['supportCC@example.com'],
                bccRecipients: ['supportBCC@example.com'],
                body: '',
                attachment: {
                  path: '',  // The absolute path of the file from which to read data.
                  type: '',   // Mime Type: jpg, png, doc, ppt, html, pdf
                  name: '',   // Optional: Custom filename for attachment
                }
              }, (error, event) => {
                if(error) {
                  console.log("bla, no email supported");
                  console.log(error);
                }
              });
            }}
            style={[sharedStyles.btn, styles.menuBtn]}>
          {strings.Menu_ExportData}
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
    alignSelf: "stretch",
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    fontSize: 18,
    textAlign: 'left',
    backgroundColor: '#ececec',
    color: 'black'
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