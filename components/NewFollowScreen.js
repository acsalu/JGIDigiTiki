import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  BackAndroid,
  DatePickerAndroid,
  Picker,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  Navigator,
  View
} from 'react-native';
import Button from 'react-native-button';

export default class NewFollowScreen extends Component {

  state = {
    beginTime: null,
    chimp: null,
    chimpPickerItems: [],
    community: null,
    hasSetDate: false,
    date: new Date(),
    researcher: ''
  };

  getCommunities = () => {
    return Array.from(new Set(this.props.chimps.map((c, i) => {
      return c.community;
    })));
  }

  getAllTimesForUser = () => {
    return this.props.times.map((val, i) => {
      // We expect something like 01-12:00J, so find the first - and take
      // everything after that.
      const dashIndex = val.indexOf('-');
      return {
        dbTime: val,
        userTime: val.substring(dashIndex + 1)
      };
    });
  };

  showDatePicker = async (stateKey, options) => {
    try {
      var newState = {};
      const {action, year, month, day} = await DatePickerAndroid.open(options);
      if (action === DatePickerAndroid.dismissedAction) {
        // newState[stateKey + 'Text'] = 'dismissed';
      } else {
        var date = new Date(year, month, day);
        // newState[stateKey + 'Text'] = date.toLocaleDateString();
        newState['date'] = date;
        newState['hasSetDate'] = true;
      }
      this.setState(newState);
    } catch ({code, message}) {
      console.warn(`Error in example '${stateKey}': `, message);
    }
  };

  getCommunityPickerItems = () => {
    const communities = this.getCommunities();
    const communityPromptPickerItem = (
        <Picker.Item key="community-prompt" label="Kundi" value={null} />
    );
    const communityPickerItems = communities.map((c, i) => {
      return (<Picker.Item key={c} label={c} value={c} />);
    });
    return [communityPromptPickerItem].concat(communityPickerItems);
  };

  getBeginTimePickerItems = () => {
    const beginTimePromptPickerItem = (
        <Picker.Item key="begin-time-prompt" label="Muda wa kuanza (s:dk)" value={null} />
    );
    const beginTimePickerItems = this.getAllTimesForUser().map((t, i) => {
      return (<Picker.Item key={t.dbTime} label={t.userTime} value={t.dbTime} />);
    });
    return [beginTimePromptPickerItem].concat(beginTimePickerItems);
  }

  getChimpPickerItems = (community) => {

    if (community === null) {
      return [];
    }

    return this.props.chimps
      .filter((c) => c.community === community)
      .map((c, i) => {
        return (<Picker.Item key={c.name} label={c.name} value={c.name} />);
      });
  }

  getDateString = (date) => {
    if (!this.state.hasSetDate) {
      return "Tarehe ya ufuataji"
    }
    return date.toString();
  }

  render() {
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
      <View>
        <Text>New Follow</Text>

        <TouchableHighlight onPress={this.showDatePicker.bind(this, '', {date: this.state.date})}>
          <Text>
            {this.getDateString(this.state.date)}
          </Text>
        </TouchableHighlight>

        <Picker selectedValue={this.state.community}
          onValueChange={(c) => this.setState({community: c, chimpPickerItems: this.getChimpPickerItems(c)})}>
          {communityPickerItems}
        </Picker>

        <Picker enabled={this.state.community !== null }
          selectedValue={this.state.chimp}
          onValueChange={(c) => this.setState({chimp: c})}>
          {this.state.chimpPickerItems}
        </Picker>

        <Picker selectedValue={this.state.beginTime}
          onValueChange={(t) => this.setState({beginTime: t})}>
          {beginTimePickerItems}
        </Picker>
        
        <TextInput
          onChangeText={(text) => this.setState({researcher: text})}
          value={this.state.researcher}
          placeholder="Jina la mtafiti"
        />

        <Button onPress={() => {
            const hasSetDate = this.state.hasSetDate;
            const hasSetBeginTime = this.state.beginTime !== null;
            const hasSetCommunity = this.state.community != null;
            const hasSetChimp = this.state.chimp != null;
            const hasSetResearcher = this.state.researcher != null

            if ([hasSetDate, hasSetBeginTime, hasSetCommunity, hasSetChimp, hasSetResearcher].some(e => !e)) {
              Alert.alert(
                'Invalid Input',
                'My Alert Msg',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed')},
                ]
              );
            } else {
              console.log('date: ' + this.state.date.toString());
              console.log('beginTime: ' + this.state.beginTime);
              console.log('community: ' + this.state.community);
              console.log('chimp: ' + this.state.chimp);
              console.log('researcher: ' + this.state.researcher);

              this.props.navigator.push({
                id: 'FollowScreen'
              });
            }
          }}
        >
          Anza
        </Button>

      </View>
    );
  }
}