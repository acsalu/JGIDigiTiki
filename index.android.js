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

import ExportDataScreen from './components/ExportDataScreen';
import FollowListScreen from './components/FollowListScreen';
import FollowScreen from './components/FollowScreen/FollowScreen';
import MenuScreen from './components/MenuScreen';
import NewFollowScreen from './components/NewFollowScreen';
import SettingsScreen from './components/SettingsScreen';
import SummaryScreen from './components/SummaryScreen/SummaryScreen';

import chimps from './data/chimp-list.json';
import times from './data/time-list.json';
import food from './data/food-list.json';
import foodParts from './data/food-part-list.json';
import species from './data/species-list.json';
import speciesNumbers from './data/species-number-list.json';
import defaultStrings from './data/strings';



const defaultLanguage = 'en';

export default class JGIDigiTiki extends Component {

  state = {
    language: defaultLanguage,
    localizedStrings: new LocalizedStrings(defaultStrings),
    enStrings: defaultStrings.en,
    swStrings: defaultStrings.sw
  };

  constructor(props) {
    super(props);
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

  render() {
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
                    chimps={chimps}
                    times={times}
                    strings={this.state.localizedStrings}
                />
              );
            case 'FollowScreen':
              const chimpsInCommunity = chimps.filter((c) => c.community === route.follow.FOL_CL_community_id);
              return (
                <FollowScreen
                  navigator={navigator}
                  chimps={chimpsInCommunity}
                  food={food}
                  foodParts={foodParts}
                  species={species}
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
