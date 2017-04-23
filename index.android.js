/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Navigator,
} from 'react-native';

import ExportDataScreen from './components/ExportDataScreen';
import FollowListScreen from './components/FollowListScreen';
import FollowScreen from './components/FollowScreen/FollowScreen';
import MenuScreen from './components/MenuScreen';
import NewFollowScreen from './components/NewFollowScreen';
import SummaryScreen from './components/SummaryScreen/SummaryScreen';

import chimps from './data/chimp-list.json';
import times from './data/time-list.json';
import food from './data/food-list.json';
import foodParts from './data/food-part-list.json';
import species from './data/species-list.json';
import speciesNumbers from './data/species-number-list.json';

export default class JGIDigiTiki extends Component {
  render() {
    return (
      <Navigator initialRoute={{id: 'MenuScreen', name: 'Index'}}
        renderScene={(route, navigator) => {
          const routeId = route.id;
          switch (routeId) {
            case 'MenuScreen':
              return (
                <MenuScreen navigator={navigator} />
              );
            case 'NewFollowScreen':
              return (
                <NewFollowScreen navigator={navigator} chimps={chimps} times={times} />
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
                />
              );
            case 'FollowListScreen':
              return (
                <FollowListScreen navigator={navigator} />
              );
            case 'ExportDataScreen':
              return (
                  <ExportDataScreen navigator={navigator} />
              );
            case 'SummaryScreen':
              const cs = chimps.filter((c) => c.community === route.follow.FOL_CL_community_id);
              return (
                  <SummaryScreen navigator={navigator}
                     follow={route.follow}
                     followTime={route.followTime}
                     chimps={cs}
                     times={times}
                  />
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
