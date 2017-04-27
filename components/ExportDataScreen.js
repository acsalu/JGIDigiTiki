import React, { Component } from 'react';
import {
  BackAndroid,
  DatePickerAndroid,
  NativeModules,
  TouchableHighlight,
  Text,
  View
} from 'react-native';
import Button from 'react-native-button';
import format from 'string-format';
import sharedStyles from './SharedStyles';
import strings from '../data/strings';
import RNFS from 'react-native-fs';
import realm from '../models/realm';

const Mailer = NativeModules.RNMail;
import { zip } from 'react-native-zip-archive';
import Orientation from 'react-native-orientation';
import Util from './util';

export default class ExportDataScreen extends Component {

  state = {
    startDate: new Date(),
    endDate: new Date()
  };

  componentDidMount() {
    Orientation.lockToPortrait();
  };

  render() {
    const follows = realm.objects('Follow')
        .filtered('FOL_date >= $0 AND FOL_date <= $1', this.state.startDate, this.state.endDate);
    // FOL_date: 'date',
    // FOL_B_AnimID: 'string',
    // FOL_CL_community_id: 'string',
    // FOL_time_begin: 'string',
    // FOL_time_end: {type: 'string', optional: true},

    // create a path you want to write to
    const dirPath = RNFS.ExternalDirectoryPath + '/follow-data';
    const zipPath = RNFS.ExternalDirectoryPath + '/follow-data.zip';

    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
        this.props.navigator.pop();
        return true;
      }
      return false;
    });

    const totalFollows = follows.length;

    let exportButtonStyles = [sharedStyles.btn, styles.menuBtn];
    if (totalFollows === 0) {
      exportButtonStyles.push(sharedStyles.btnDisabled);
    }

    return(
      <View style={styles.container}>

        <View style={styles.dateInputGroup}>
          <TouchableHighlight
              onPress={this.showDatePicker.bind(this, 'startDate', {date: this.state.startDate})}>
            <Text style={[styles.dateInput, styles.dateInputText]}>
              {Util.getDateString(this.state.startDate)}
            </Text>
          </TouchableHighlight>
          <Text style={styles.dateInput}> - </Text>
          <TouchableHighlight
              onPress={this.showDatePicker.bind(this, 'endDate', {date: this.state.endDate})}>
            <Text style={[styles.dateInput, styles.dateInputText]}>
              {Util.getDateString(this.state.endDate)}
            </Text>
          </TouchableHighlight>
        </View>

        <Text style={styles.followCountText}>{totalFollows} Follows</Text>

          <Button
              disabled={follows.length === 0}
              onPress={() => {
                this.exportButtonPressed(follows, dirPath, zipPath);
              }}
              style={exportButtonStyles}>
            {strings.Menu_ExportData}
          </Button>
      </View>
    );
  }

  showDatePicker = async (stateKey, options) => {
    try {
      let newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) {
        // newState[stateKey + 'Text'] = 'dismissed';
      } else {
        let date = new Date(year, month, day);
        // newState[stateKey + 'Text'] = date.toLocaleDateString();
        newState[stateKey] = date;
      }
      this.setState(newState);
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  }

  async exportButtonPressed(follows, dirPath, zipPath) {
    if (await RNFS.exists(dirPath)) {
      await RNFS.unlink(dirPath);
    }
    if (await RNFS.exists(zipPath)) {
      await RNFS.unlink(zipPath);
    }

    RNFS.mkdir(dirPath);
    await this.exportFollows(follows, dirPath);
    let result = await RNFS.readDir(`${dirPath}`);
    console.log(result);

    console.log(`zip ${dirPath} into ${RNFS.DocumentDirectoryPath}/myFile.zip`);
    await zip(dirPath, zipPath)
      .then((path) => {
        console.log(`zip completed at ${path}`)
        this.openEmailClient(path);
      })
      .catch((error) => {
        console.log(error)
      });
  }

  async exportFollows(follows, path) {
    for (let follow of follows) {
      await this.exportFollow(follow, path);
    }
  }

  async exportFollow(follow, path) {
    const prefix = Util.getDateString(follow.FOL_date) + '-' + follow.FOL_B_AnimID;

    const followArrivals = this._getFollowArrivals(follow);
    const foods = this._getFoods(follow);
    const species = this._getSpecies(follow);

    console.log(format("{0} follow arrivals / {1} foods / {2} species", followArrivals.length, foods.length, species.length));

    await this._exportFollow(follow, path, prefix);
    await this._exportFollowArrivals(followArrivals, path, prefix);
    await this._exportFoods(foods, path, prefix);
    await this._exportSpecies(species, path, prefix);
  }

  _getFollowArrivals(follow) {
    return this._getFollowData(follow, 'FollowArrival');
  }

  _getFoods(follow) {
    return this._getFollowData(follow, 'Food');
  }

  _getSpecies(follow) {
    return this._getFollowData(follow, 'Species');
  }

  _getFollowData(follow, className) {
    return realm.objects(className)
        .filtered('focalId = $0 AND date = $1', follow.FOL_B_AnimID, follow.FOL_date);
  }

  async _exportFollow(follow, path, prefix) {
    const csvFilePath = `${path}/${prefix}-follow.csv`;
    const csvFields = [
      'FOL_date',
      'FOL_B_AnimID',
      'FOL_CL_community_id',
      'FOL_time_begin',
      'FOL_am_observer1',
      'FOL_day',
      'FOL_month',
      'FOL_year'
    ];

    await this._exportObjectsToCsv([follow], csvFilePath, csvFields, csvFields);
  }

  async _exportFollowArrivals(followArrivals, path, prefix) {
    const csvFilePath = `${path}/${prefix}-follow-arrival.csv`;

    const csvFields = [
      'FA_FOL_date',
      'FA_FOL_B_focal_AnimID',
      'FA_B_arr_AnimID',
      'FA_type_of_certainty',
      'FA_type_of_nesting',
      'FA_type_of_cycle',
      'FA_type_of_grooming',
      'FA_type_is_neareat_neighbor',
      'FA_type_is_within_5m'
    ];
    const objectFields = [
      'date', 'focalId', 'chimpId', 'certainty',
      'time', 'estrus', 'grooming', 'isNearestNeighbor', 'isWithin5m'
    ];

    await this._exportObjectsToCsv(followArrivals, csvFilePath, csvFields, objectFields);
  }

  async _exportFoods(foods, path, prefix) {
    const csvFilePath = `${path}/${prefix}-food.csv`;
    const csvFields = [
      'FB_FOL_date',
      'FB_FOL_B_AnimId',
      'FB_begin_feed_time',
      'FB_end_feed_time',
      'FB_FPL_local_food_part',
      'FB_FL_local_food_name'
    ];
    const objectFields = [
      'date', 'focalId', 'startTime', 'endTime', 'foodName', 'foodPart'
    ];

    await this._exportObjectsToCsv(foods, csvFilePath, csvFields, objectFields);
  }

  async _exportSpecies(species, path, prefix) {
    const csvFilePath = `${path}/${prefix}-other-species.csv`;
    const csvFields = [
      'OS_FOL_date',
      'OS_FOL_B_focal_AnimId',
      'OS_time_begin',
      'OS_time_end',
      'OS_OSL_local_species_name',
      'OS_duration'
    ];
    const objectFields = [
      'date', 'focalId', 'startTime', 'endTime', 'speciesName', 'speciesCount'
    ];

    await this._exportObjectsToCsv(species, csvFilePath, csvFields, objectFields);
  }

  async _exportObjectsToCsv(objects, filePath, csvFields, objectFields) {
    var csvContent = csvFields.join(",");
    for (const object of objects) {
      const data = objectFields.map((of, i) => object[of].toString());
      csvContent += '\n' + data.join(",");
    }
    await RNFS.writeFile(filePath, csvContent, 'utf8');
  }

  openEmailClient(attachmentPath) {
    console.log(format("=== openEmailClient {0} ===", attachmentPath));
    Mailer.mail({
      subject: 'JGI DigiTiki Data Export',
      recipients: [],
      ccRecipients: [],
      bccRecipients: [],
      body: '',
      attachment: {
        path: attachmentPath,  // The absolute path of the file from which to read data.
        type: 'zip',   // Mime Type: jpg, png, doc, ppt, html, pdf
        name: 'data.zip',   // Optional: Custom filename for attachment
      }
    }, (error, event) => {
      if(error) {
        console.log("bla, no email supported");
        console.log(error);
      }
    });
  }
}

const styles = {
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor:'white',
    alignItems: 'center',
    paddingTop: 30
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
  },
  dateInputGroup: {
    flexDirection: 'row',
  },
  dateInput: {
    fontSize: 20,
    marginLeft: 10,
    marginRight: 10
  },
  dateInputText: {
    borderBottomWidth: 1,
    paddingLeft: 10,
    paddingRight: 10
  },
  followCountText: {
    marginTop: 10,
    fontSize: 15
  }
};