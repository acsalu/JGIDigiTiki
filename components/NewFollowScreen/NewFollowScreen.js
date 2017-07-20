import React, { Component } from 'react';
import {
  Alert,
  BackAndroid,
  DatePickerAndroid,
  Keyboard,
  Picker,
  TouchableHighlight,
  Text,
  TextInput,
  View
} from 'react-native';
import Button from 'react-native-button';
import Orientation from 'react-native-orientation';

import realm from '../../models/realm';
import sharedStyles from '../SharedStyles';
import Util from '../util';

export default class NewFollowScreen extends Component {

  state = {
    beginTime: null,
    chimpPickerItems: [],
    community: null,
    focalChimpId: null,
    date: new Date(),
    researcher: ''
  };

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  getCommunities = () => {
    return Array.from(new Set(this.props.chimps.map((c, i) => {
      return c.community;
    })));
  }

  getAllTimesForUser = () => {
    return this.props.times.map((val, i) => {
      return {
        dbTime: val,
        userTime: Util.dbTime2UserTime(val)
      };
    });
  };

  showDatePicker = async (stateKey, options) => {
    try {
      let newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) {
        // newState[stateKey + 'Text'] = 'dismissed';
      } else {
        let date = new Date(year, month, day);
        // newState[stateKey + 'Text'] = date.toLocaleDateString();
        newState['date'] = date;
      }
      this.setState(newState);
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  };

  getCommunityPickerItems = () => {
    const strings = this.props.strings;
    const communities = this.getCommunities();
    const communityPromptPickerItem = (
        <Picker.Item key="community-prompt" label={strings.NewFollow_Community} value={null} />
    );
    const communityPickerItems = communities.map((c, i) => {
      return (<Picker.Item key={c} label={c} value={c} />);
    });
    return [communityPromptPickerItem].concat(communityPickerItems);
  };

  getBeginTimePickerItems = () => {
    const strings = this.props.strings;
    const beginTimePromptPickerItem = (
        <Picker.Item key="begin-time-prompt" label={strings.NewFollow_BeginTime + " " + strings.TimeFormat} value={null} />
    );
    const beginTimePickerItems = this.getAllTimesForUser().map((t, i) => {
      return (<Picker.Item key={t.dbTime} label={t.userTime} value={t.dbTime} />);
    });
    return [beginTimePromptPickerItem].concat(beginTimePickerItems);
  }

  getChimpPickerItems = (community) => {
    const strings = this.props.strings;
    if (community === null) {
      return [];
    }
    const defaultPickerItem = (<Picker.Item key='Target' label={strings.NewFollow_Target} value={null}/>);

    const chimpPickerItems = this.props.chimps
        .filter((c) => c.community === community)
        .map((c, i) => {
          return (<Picker.Item key={c.name} label={c.name} value={c.name}/>);
        });
    return [defaultPickerItem].concat(chimpPickerItems);
  }

  packChimps = (chimps) => {
    return chimps.map((c, i) => realm.create('Chimp', {name: c.name, sex: c.sex}));
  }

  packValuePairs = (valuePairs) => {
    return valuePairs.map((p, i) => realm.create('ValuePairObject', {
      dbValue: p[0] === null ? 'NULL' : p[0],
      userValue: p[1]
    }));
  }

  render() {
    const strings = this.props.strings;
    const communityPickerItems = this.getCommunityPickerItems();
    const beginTimePickerItems = this.getBeginTimePickerItems();

    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
        this.props.navigator.pop();
        return true;
      }
      return false;
    });

    return(
      <View style={styles.container}>
        <Text style={styles.description}>{strings.NewFollow_Title}</Text>

        <TouchableHighlight
            style={styles.inputField}
            onPress={this.showDatePicker.bind(this, '', {date: this.state.date})}>
          <Text style={styles.datePickerText}>
            {Util.getDateString(this.state.date)}
          </Text>
        </TouchableHighlight>

        <Picker
            style={styles.inputField}
            selectedValue={this.state.community}
            onValueChange={(c) => this.setState({community: c, chimpPickerItems: this.getChimpPickerItems(c)})}>
          {communityPickerItems}
        </Picker>

        <Picker
            style={styles.inputField}
            enabled={this.state.community !== null }
            selectedValue={this.state.focalChimpId}
            onValueChange={(c) => this.setState({focalChimpId: c})}>
          {this.state.chimpPickerItems}
        </Picker>

        <Picker
            style={styles.inputField}
            selectedValue={this.state.beginTime}
            onValueChange={(t) => this.setState({beginTime: t})}>
          {beginTimePickerItems}
        </Picker>
        
        <TextInput
            style={[styles.inputField, styles.researcherNameTextInput]}
            onChangeText={(text) => this.setState({researcher: text})}
            value={this.state.researcher}
            placeholder={strings.NewFollow_ResearcherName}
        />

        <Button
            style={[styles.beginBtn, sharedStyles.btn, sharedStyles.btnSuccess]}
            onPress={() => {

              // Dismiss keyboard
              Keyboard.dismiss();

              const hasSetBeginTime = this.state.beginTime !== null;
              const hasSetCommunity = this.state.community != null;
              const hasSetFocalChimpId = this.state.focalChimpId != null;
              const hasSetResearcher = this.state.researcher != null

              if ([hasSetBeginTime, hasSetCommunity, hasSetFocalChimpId, hasSetResearcher].some(e => !e)) {
                Alert.alert(
                  'Invalid Input',
                  'My Alert Msg',
                  [
                    {text: 'OK', onPress: () => console.log('OK Pressed')},
                  ]
                );
              } else {
                const year = this.state.date.getYear() + 1900;
                const month = this.state.date.getMonth() + 1;
                const day = this.state.date.getDate();

                realm.write(() => {
                  const chimps = this.packChimps(this.props.chimps.filter((c) => c.community === this.state.community));
                  const food = this.packValuePairs(this.props.food);
                  const foodParts = this.packValuePairs(this.props.foodParts);
                  const species = this.packValuePairs(this.props.species);

                  const newFollow = realm.create('Follow', {
                     date: this.state.date,
                     focalId: this.state.focalChimpId,
                     community: this.state.community,
                     startTime: this.state.beginTime,
                     amObserver1: this.state.researcher,
                     chimps: chimps,
                     food: food,
                     foodParts: foodParts,
                     species: species,
                     day: day,
                     month: month,
                     year: year
                  });
                });

                const follow = realm.objects('Follow').slice(-1).pop();

                this.props.navigator.replace({
                  id: 'FollowScreen',
                  follow: follow,
                  followTime: this.state.beginTime
                });
              }
            }}
        >
          Begin
        </Button>

      </View>
    );
  }
}


const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor:'white',
    alignItems: 'center'
  },
  description: {
    alignSelf: "stretch",
    marginTop: 30,
    marginBottom: 50,
    fontSize: 44,
    textAlign: 'center',
    lineHeight: 40,
    color: 'black'
  },
  beginBtn: {
    width: 500,
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15
  },

  inputField: {
    width: 500,
  },
  datePickerText: {
    fontSize: 16,
    paddingLeft: 6,
    paddingBottom: 10,
    borderBottomWidth: 1
  },
  researcherNameTextInput: {
    paddingLeft: 6,
    fontSize: 16
  }
};