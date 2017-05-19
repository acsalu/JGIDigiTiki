import React, { Component } from 'react';
import {
  AsyncStorage,
  AppRegistry,
  StyleSheet,
  Navigator,
} from 'react-native';
import LocalizedStrings from 'react-native-localization';
import assert from 'assert';
import _ from 'lodash';
import RNFS from 'react-native-fs';

import ExportDataScreen from './components/ExportDataScreen';
import FollowListScreen from './components/FollowListScreen';
import FollowScreen from './components/FollowScreen/FollowScreen';
import MenuScreen from './components/MenuScreen';
import NewFollowScreen from './components/NewFollowScreen';
import SettingsScreen from './components/SettingsScreen';
import SummaryScreen from './components/SummaryScreen/SummaryScreen';

import times from './data/time-list.json';
import defaultChimps from './data/chimp-list.json';
import defaultFood from './data/food-list.json';
import foodParts from './data/food-part-list.json';
import defaultSpecies from './data/species-list.json';
import speciesNumbers from './data/species-number-list.json';
import defaultStrings from './data/strings';

const defaultLanguage = 'en';

export default class JGIDigiTiki extends Component {

  constructor(props) {
    super(props);

    this.state = {
      language: defaultLanguage,
      localizedStrings: new LocalizedStrings(defaultStrings),
      enStrings: defaultStrings.en,
      swStrings: defaultStrings.sw,
      chimps: defaultChimps,
      food: defaultFood,
      species: defaultSpecies
    };

    this._loadCustomData('chimp-list.json', 'chimps');
    this._loadCustomData('food-list.json', 'food');
    this._loadCustomData('species-list.json', 'species');
  }

  componentWillMount() {
    this._loadLocalizedStrings();
    this._loadDefaultLanguage();
  }

  async _updateLocalizedString(language, key, newString) {
    await AsyncStorage.setItem(`@JGIDigiTiki:strings_${language}_${key}`, newString);
    this._loadLocalizedStrings();
  }

  async _loadDefaultLanguage() {
    try {
      const language = await AsyncStorage.getItem('@JGIDigiTiki:language');
      if (language !== null) {
        this._setLanguage(language);
        return;
      }
      await AsyncStorage.setItem('@JGIDigiTiki:language', defaultLanguage);
      this._setLanguage(defaultLanguage);
    } catch(error) {
      console.error(error);
    }
  }

  async _loadLocalizedStrings() {
    try {
      let enStrings = {};
      for (const key in defaultStrings.en) {
        const storageKey = `@JGIDigiTiki:strings_en_${key}`;
        let enString = await  AsyncStorage.getItem(storageKey);
        if (enString === null) {
          enString = defaultStrings.en[key]
          await AsyncStorage.setItem(storageKey, enString);
        }
        enStrings[key] = enString;
      }
      assert(Object.keys(enStrings).length === Object.keys(defaultStrings.en).length);

      let swStrings = {};
      for (const key in defaultStrings.sw) {
        const storageKey = `@JGIDigiTiki:strings_sw_${key}`;
        let swString = await  AsyncStorage.getItem(storageKey);
        if (swString === null) {
          swString = defaultStrings.sw[key]
          await AsyncStorage.setItem(storageKey, swString);
        }
        swStrings[key] = swString;
      }
      assert(Object.keys(swStrings).length === Object.keys(defaultStrings.sw).length);

      this.setState({
        enStrings: enStrings,
        swStrings: swStrings,
        localizedStrings: new LocalizedStrings({'en': enStrings, 'sw': swStrings})
      });
    } catch(error) {
      console.error(error);
    }
  }

  _setLanguage(language) {
    if (language !== this.state.language) {
      this.state.localizedStrings.setLanguage(language);
      this.setState({language: language});
    }
  }

  async _loadCustomData(fileName, fieldName) {
    const filePath = RNFS.ExternalStorageDirectoryPath + '/Download/' + fileName;
    if (await RNFS.exists(filePath)) {
      console.log("custom data file for " + fieldName + " exists");
      let customData = await RNFS.readFile(filePath);
      customData = JSON.parse(customData);

      let newState = {};
      newState[fieldName] = customData;
      this.setState(newState);
    }
  }

  render() {
    console.log(this.state.chimps.length);
    return (
      <Navigator initialRoute={{id: 'MenuScreen', name: 'Index'}}
        renderScene={(route, navigator) => {
          const routeId = route.id;
          switch (routeId) {
            case 'MenuScreen':
              return (
                <MenuScreen
                    navigator={navigator}
                    strings={this.state.localizedStrings}
                />
              );
            case 'NewFollowScreen':
              return (
                <NewFollowScreen
                    navigator={navigator}
                    chimps={this.state.chimps}
                    times={times}
                    strings={this.state.localizedStrings}
                />
              );
            case 'FollowScreen':
              const chimpsInCommunity = this.state.chimps.filter((c) => c.community === route.follow.FOL_CL_community_id);
              return (
                <FollowScreen
                  navigator={navigator}
                  chimps={chimpsInCommunity}
                  food={this.state.food}
                  foodParts={foodParts}
                  species={this.state.species}
                  speciesNumbers={speciesNumbers}
                  follow={route.follow}
                  followTime={route.followTime}
                  followArrivals={route.followArrivals}
                  times={times}
                  strings={this.state.localizedStrings}
                />
              );
            case 'FollowListScreen':
              return (
                <FollowListScreen
                    navigator={navigator}
                    strings={this.state.localizedStrings}
                />
              );
            case 'ExportDataScreen':
              return (
                  <ExportDataScreen
                      navigator={navigator}
                      strings={this.state.localizedStrings}
                  />
              );
            case 'SummaryScreen':
              const cs = chimps.filter((c) => c.community === route.follow.FOL_CL_community_id);
              return (
                  <SummaryScreen navigator={navigator}
                     follow={route.follow}
                     chimps={cs}
                     times={times}
                     strings={this.state.localizedStrings}
                  />
              );
            case 'SettingsScreen':
              return (
                  <SettingsScreen
                      navigator={navigator}
                      language={this.state.language}
                      onLanguageChanged={(language)=> {
                        console.log('index get new language:', language);
                        this._setLanguage(language);
                      }}
                      strings={this.state.localizedStrings}
                      enStrings={this.state.enStrings}
                      swStrings={this.state.swStrings}
                      onLocalizedStringUpdated={this._updateLocalizedString.bind(this)}
                  >

                  </SettingsScreen>
              );
            default:
              break;
          }
        }}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FadeAndroid;
        }}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('JGIDigiTiki', () => JGIDigiTiki);
