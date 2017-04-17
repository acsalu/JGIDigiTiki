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

import sharedStyles from './SharedStyles';
import strings from '../data/strings';
import RNFS from 'react-native-fs';
import realm from '../models/realm';

const Mailer = NativeModules.RNMail;

export default class ExportDataScreen extends Component {

  render() {
    const follows = realm.objects('Follow');
    // FOL_date: 'date',
    // FOL_B_AnimID: 'string',
    // FOL_CL_community_id: 'string',
    // FOL_time_begin: 'string',
    // FOL_time_end: {type: 'string', optional: true},
    const csvFields = ['FOL_date', 'FOL_B_AnimID', 'FOL_CL_community_id'];

    var csvContent = csvFields.join(",");
    follows.forEach((follow, index) => {
      data = [follow.FOL_date, follow.FOL_B_AnimID, follow.FOL_CL_community_id];
      data = data.map((d, i) => d.toString());
      dataString = data.join(",");
      csvContent += '\n' + dataString;
    });

    // create a path you want to write to
    const path = RNFS.ExternalDirectoryPath + '/test.csv';

    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
        this.props.navigator.pop();
        return true;
      }
      return false;
    });

    return(
        <Image source={require('../img/chimp.png')} style={styles.container}>

          <Button
              onPress={() => {
                console.log(path);

                // write the file
                RNFS.writeFile(path, csvContent, 'utf8')
                    .then((success) => {
                      console.log('FILE WRITTEN!');

                      Mailer.mail({
                        subject: 'need help',
                        recipients: ['support@example.com'],
                        ccRecipients: ['supportCC@example.com'],
                        bccRecipients: ['supportBCC@example.com'],
                        body: '',
                        attachment: {
                          path: path,  // The absolute path of the file from which to read data.
                          type: 'txt',   // Mime Type: jpg, png, doc, ppt, html, pdf
                          name: 'test.csv',   // Optional: Custom filename for attachment
                        }
                      }, (error, event) => {
                        if(error) {
                          console.log("bla, no email supported");
                          console.log(error);
                        }
                      });
                    })
                    .catch((err) => {
                      console.log(err.message);
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