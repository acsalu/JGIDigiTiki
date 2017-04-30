import React, {Component} from 'react';
import {
  BackAndroid,
  ScrollView,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { RadioButtons } from 'react-native-radio-buttons'
import assert from 'assert';

import SharedStyles from './SharedStyles';

class LocalizedTextSettingRow extends Component {

  _onEndEditingHandler(language, text) {
    this.props.onLocalizedStringUpdated(language, this.props.localizedStringKey, text);
  }

  render() {
    return(
        <View style={styles.localizedTextSettingRow}>
          <Text>{this.props.localizedStringKey}</Text>
          <View style={styles.localizedTextSettingRowItemGroup}>
            <TextInput
                style={styles.localizedTextSettingRowItem}
                onEndEditing={(event) => {this._onEndEditingHandler('en', event.nativeEvent.text)}}
            >
              {this.props.enString}
            </TextInput>
            <TextInput
                style={styles.localizedTextSettingRowItem}
                onEndEditing={(event) => {this._onEndEditingHandler('sw', event.nativeEvent.text)}}
            >
              {this.props.swString}
            </TextInput>
          </View>
        </View>
    )
  }
}

export default class SettingsScreen extends Component {

  state = {
    selectedOption: 'en'
  };

  componentWillReceiveProps(nextProps) {
    this.setState({
      selectedOption: this.props.language
    });
  }

  componentWillMount() {
    BackAndroid.addEventListener('hardwareBackPress', () => {
      if (this.props.navigator && this.props.navigator.getCurrentRoutes().length > 1) {
        this.props.navigator.pop();
        return true;
      }
      return false;
    });
  }

  render() {

    const languageOptions = ["en", "sw"];

    function setSelectedOption(selectedOption){
      // this.setState({selectedOption: selectedOption});
      console.log("setSelectionOption:", selectedOption);
      this.props.onLanguageChanged(selectedOption);
    }

    function renderOption(option, selected, onSelect, index){
      console.log("renderOption", option, selected);
      let optionStyles = [styles.languageOption];
      if (selected) {
        optionStyles.push(SharedStyles.btnPrimary, {color: 'white'});
      }

      return (
          <TouchableWithoutFeedback onPress={onSelect} key={index}>
            <View><Text style={optionStyles}>{option}</Text></View>
          </TouchableWithoutFeedback>
      );
    }

    function renderContainer(optionNodes){
      return <View style={styles.languageOptions}>{optionNodes}</View>;
    }

    let localizedTextSettingRows = [];
    for (const key in this.props.enStrings) {
      localizedTextSettingRows.push(<LocalizedTextSettingRow
          key={key}
          onLocalizedStringUpdated={this.props.onLocalizedStringUpdated}
          localizedStringKey={key}
          enString={this.props.enStrings[key]}
          swString={this.props.swStrings[key]}
      />);
    }

    return(
     <View style={styles.container}>
       <Text>Settings</Text>
       <View style={styles.languageOptionsGroup}>
         <Text>Language: </Text>
         <RadioButtons
             options={ languageOptions }
             onSelection={ setSelectedOption.bind(this) }
             selectedOption={ this.state.selectedOption }
             renderOption={ renderOption }
             renderContainer={ renderContainer }
         />
       </View>
       <Text>Selected option: {this.state.selectedOption || 'none'}</Text>
       <ScrollView style={styles.localizedTextSettingRows}>
        {localizedTextSettingRows}
       </ScrollView>
     </View>
    );
  }
}

const styles = {
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center'
  },
  languageOptionsGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageOptions: {
    flexDirection: 'row'
  },
  languageOption: {
    borderWidth: 1,
    paddingTop: 6,
    paddingBottom: 6,
    paddingLeft: 50,
    paddingRight: 50
  },
  localizedTextSettingRows: {
    alignSelf: 'stretch',
  },
  localizedTextSettingRow: {
    alignSelf: 'stretch',
    flexDirection: 'column'
  },
  localizedTextSettingRowItemGroup: {
    alignSelf: 'stretch',
    flexDirection: 'row'
  },
  localizedTextSettingRowItem: {
    flex: 0.5
  }
};