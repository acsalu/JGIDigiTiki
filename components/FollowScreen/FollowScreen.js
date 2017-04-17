import React, { Component } from 'react';
import {
  Alert,
  ActivityIndicator,
  AppRegistry,
  DatePickerAndroid,
  Dimensions,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  Modal,
  Navigator,
  Picker,
  View
} from 'react-native';
import FollowArrivalTable from './FollowArrivalTable';
import ItemTrackerModal from './ItemTrackerModal';
import FollowScreenHeader from './FollowScreenHeader';
import Util from '../util';

import realm from '../../models/realm';
import strings from '../../data/strings';
import _ from 'lodash';
import BusyIndicator from 'react-native-busy-indicator';
import loaderHandler from 'react-native-busy-indicator/LoaderHandler';

const ModalType = Object.freeze({
  none: 0,
  food: 1,
  species: 2
});

export default class FollowScreen extends Component {

  watchID: ?number = null;

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("get position:", JSON.stringify(position));
          realm.write(() => {
            const newLocation = realm.create('Location', {
              timestamp: position.timestamp,
              longitude: position.coords.longitude,
              latitude: position.coords.latitude,
              altitude: position.coords.altitude,
              accuracy: position.coords.accuracy
            });
          });
        },
        (error) => alert(JSON.stringify(error)),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  constructor(props) {

    super(props);

    const focalId = this.props.follow.FOL_B_AnimID;
    const date = this.props.follow.FOL_date;

    if (this.props.followArrivals !== undefined && this.props.followArrivals !== null) {
      // Write follows from previous into db

      realm.write(() => {
        Object.keys(this.props.followArrivals).forEach((key, index) => {
          const fa = this.props.followArrivals[key];
          const newArrival = realm.create('FollowArrival', {
            date: this.props.follow.FOL_date,
            followStartTime: this.props.followTime,
            focalId: this.props.follow.FOL_B_AnimID,
            chimpId: fa.chimpId,
            time: fa.time,
            certainty: fa.certainty,
            estrus: fa.estrus,
            isWithin5m: fa.isWithin5m,
            isNearestNeighbor: fa.isNearestNeighbor,
            grooming: fa.grooming
          });
        });
      });
    }

    loaderHandler.showLoader('Loading More');

    let followArrivals = {};
    // Populate followArrival in db
    const allFollowArrival = realm.objects('FollowArrival')
        .filtered('focalId = $0 AND date = $1 AND followStartTime = $2', focalId, date, this.props.followTime);
    for (let i = 0; i < allFollowArrival.length; i++) {
      const arrival = allFollowArrival[i];
      followArrivals[arrival.chimpId] = arrival;
    }

    // Populate food in db
    const allFood = realm.objects('Food')
        .filtered('focalId = $0 AND date = $1', focalId, date);

    let activeFood = [];
    let finishedFood = [];

    for (let i = 0; i < allFood.length; i++) {
      const food = allFood[i];
      if (food.endTime === 'ongoing') {
        activeFood.push(food);
      } else {
        finishedFood.push(food);
      }
    }

    // Populate species in db
    const allSpecies = realm.objects('Species')
        .filtered('focalId = $0 AND date = $1', focalId, date);

    let activeSpecies = [];
    let finishedSpecies = [];

    for (let i = 0; i < allSpecies.length; i++) {
      const species = allSpecies[i];
      if (species.endTime === 'ongoing') {
        activeSpecies.push(species);
      } else {
        finishedSpecies.push(species);
      }
    }

    const maleChimpsSorted = this.getSortedChimps(this.props.chimps, 'M', followArrivals);
    const femaleChimpsSorted = this.getSortedChimps(this.props.chimps, 'F', followArrivals);

    this.state = {
      modalVisible: false,
      activeFood: activeFood,
      finishedFood: finishedFood,
      activeSpecies: activeSpecies,
      finishedSpecies: finishedSpecies,
      modalMainList: [],
      modalSubList: [],
      modalType: ModalType.none,
      itemTrackerInitialStartTime: null,
      itemTrackerInitialEndTime: null,
      itemTrackerInitialMainSelection: null,
      itemTrackerInitialSecondarySelection: null,
      followArrivals: followArrivals,
      selectedChimp: null,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      maleChimpsSorted: maleChimpsSorted,
      femaleChimpsSorted: femaleChimpsSorted
    };
  };

  getSortedChimps(chimps, sex, followArrivals) {
    const sexChimps = chimps.filter((c) => c.sex === sex);
    const presentChimps = sexChimps.filter((c) => followArrivals[c.name] !== undefined);
    const unpresentChimps = sexChimps.filter((c) => followArrivals[c.name] === undefined);
    return presentChimps.sort(Util.compareChimp).concat(unpresentChimps.sort((Util.compareChimp)));
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  updateItemTrackerData(type, data) {
    switch (type) {
      case ModalType.food:
        this.setState({
          modalType: ModalType.food,
          modalMainList: this.props.food,
          modalSubList: this.props.foodParts,
          itemTrackerInitialStartTime: data ? data.startTime : null,
          itemTrackerInitialEndTime: data ? data.endTime : null,
          itemTrackerInitialMainSelection: data ? data.foodName : null,
          itemTrackerInitialSecondarySelection: data ? data.foodPart : null,
        });
        break;
      case ModalType.species:
        this.setState({
          modalType: ModalType.species,
          modalMainList: this.props.species,
          modalSubList: this.props.speciesNumbers,
          itemTrackerInitialStartTime: data ? data.startTime : null,
          itemTrackerInitialEndTime: data ? data.endTime : null,
          itemTrackerInitialMainSelection: data ? data.speciesName : null,
          itemTrackerInitialSecondarySelection: data ? data.speciesCount : null,
        });
        break;
    }
  }

  editFood(foodName, foodPart, foodList) {
    const food = foodList.filter((f) => f.foodName === foodName && f.foodPart === foodPart)[0];
    this.updateItemTrackerData(ModalType.food, food);
    this.setModalVisible(true);
  }

  editSpecies(speciesName, speciesList) {
    const species = speciesList.filter((s) => s.speciesName === speciesName)[0];
    this.updateItemTrackerData(ModalType.species, species);
    this.setModalVisible(true);
  }

  navigateToFollowTime(followTime, followArrivals) {
    if (followArrivals !== null) {
      let updatedFollowArrivals = {};
      const keys = Object.keys(followArrivals);
      console.log('keys', keys);
      for (let i = 0; i < keys.length; ++i) {
        const k = keys[i];
        const fa = followArrivals[k];
        if (fa.time.startsWith('arrive')) {
          let newFa = _.extend({}, fa);
          newFa.time = 'arriveContinues';
          newFa.isWithin5m = 'none';
          newFa.isNearestNeighbor = 'none';
          newFa.grooming = 'none';
          updatedFollowArrivals[k] = newFa;
        }

        this.props.navigator.replace({
          id: 'FollowScreen',
          follow: this.props.follow,
          followTime: followTime,
          followArrivals: updatedFollowArrivals
        });
      }
    } else {
      this.props.navigator.replace({
        id: 'FollowScreen',
        follow: this.props.follow,
        followTime: followTime
      });
    }
  }

  render() {
    const beginFollowTime = this.props.follow.FOL_time_begin;
    const beginFollowTimeIndex = this.props.times.indexOf(beginFollowTime);
    const followTimeIndex = this.props.times.indexOf(this.props.followTime);
    const previousFollowTime = followTimeIndex !== beginFollowTimeIndex ? this.props.times[followTimeIndex - 1] : null;
    const nextFollowTime = followTimeIndex !== this.props.times.length - 1 ? this.props.times[followTimeIndex + 1] : null;

    return(
      <View style={styles.container}>

        <ItemTrackerModal
            title={this.state.modalMainList == this.props.food ? "Food" : "Species"}
            visible={this.state.modalVisible}
            mainList={this.state.modalMainList}
            secondaryList={this.state.modalSubList}
            beginFollowTime={this.props.followTime}
            initialStartTime={this.state.itemTrackerInitialStartTime}
            initialEndTime={this.state.itemTrackerInitialEndTime}
            initialMainSelection={this.state.itemTrackerInitialMainSelection}
            initialSecondarySelection={this.state.itemTrackerInitialSecondarySelection}
            onDismiss={()=>{this.setModalVisible(false)}}
            onSave={(data, isEditing)=>{
              const className = this.state.modalType === ModalType.food ? 'Food' : 'Species';
              const mainFieldName = this.state.modalType === ModalType.food ? 'foodName' : 'speciesName';
              const secondaryFieldName = this.state.modalType === ModalType.food ? 'foodPart' : 'speciesCount';
              let newActiveList = this.state.modalType === ModalType.food ? this.state.activeFood : this.state.activeSpecies;
              let newFinishedList = this.state.modalType === ModalType.food ? this.state.finishedFood : this.state.finishedSpecies;

              realm.write(() => {
                if (!isEditing) {
                  let objectDict = {
                    date: this.props.follow.FOL_date,
                    focalId: this.props.follow.FOL_B_AnimID,
                    startTime: data.startTime,
                    endTime: data.endTime
                  };
                  objectDict[mainFieldName] = data.mainSelection;
                  objectDict[secondaryFieldName] = data.secondarySelection;

                  const newObject = realm.create(className, objectDict);

                  if (data.endTime === 'ongoing') {
                    newActiveList.push(newObject);
                    if (this.state.modalType === ModalType.food) {
                      this.setState({activeFood: newActiveList});
                    } else {
                      this.setState({activeSpecies: newActiveList});
                    }
                  } else {
                    newFinishedList.push(newObject);
                    if (this.state.modalType === ModalType.food) {
                      this.setState({finishedFood: newFinishedList});
                    } else {
                      this.setState({finishedSpecies: newFinishedList});
                    }
                  }
                } else {

                  let object = newActiveList.filter((o) => o[mainFieldName] === data.mainSelection && o[secondaryFieldName] === data.secondarySelection)[0];
                  object.startTime = data.startTime;
                  object.endTime = data.endTime;

                  if (data.endTime !== 'ongoing') {
                    const index = newActiveList.indexOf(object);
                    newActiveList.splice(index, 1);
                    newFinishedList.push(object);
                    if (this.state.modalType === ModalType.food) {
                      this.setState({activeFood: newActiveList, finishedFood: newFinishedList});
                    } else {
                      this.setState({activeSpecies: newActiveList, finishedSpecies: newFinishedList});
                    }
                  }
                }
              });
            }}
        />

        <FollowScreenHeader
            styles={styles.followScreenHeader}
            follow={this.props.follow}
            followTime={this.props.followTime}
            activeFood={this.state.activeFood.map((f, i) => f.foodName + ' ' + f.foodPart)}
            finishedFood={this.state.finishedFood.map((f, i) => f.foodName + ' ' + f.foodPart)}
            activeSpecies={this.state.activeSpecies.map((s, i) => s.speciesName)}
            finishedSpecies={this.state.finishedSpecies.map((s, i) => s.speciesName)}
            onPreviousPress={()=> {
              this.navigateToFollowTime(previousFollowTime, null);
            }}
            onNextPress={()=>{
              const followArrivals =
                  Object.keys(this.state.followArrivals).map(key => this.state.followArrivals[key]);
              const hasNearest = followArrivals.some((fa, i) => fa.isNearestNeighbor);
              const hasWithin5m = followArrivals.some((fa, i) => fa.isWithin5m);
              const hasOpenFood = this.state.activeFood.length !== 0;
              const hasOpenSpeices = this.state.activeSpecies.length !== 0;

              if (!hasNearest || !hasWithin5m || hasOpenFood || hasOpenSpeices) {
                let alertMessages = [];
                if (!hasNearest) { alertMessages.push(strings.Follow_NextDataValidationAlertMessageNoNearest); }
                if (!hasWithin5m) { alertMessages.push(strings.Follow_NextDataValidationAlertMessageNoWithIn5m); }
                if (hasOpenFood) { alertMessages.push(strings.Follow_NextDataValidationAlertMessageOpenFood); }
                if (hasOpenSpeices) { alertMessages.push(strings.Follow_NextDataValidationAlertMessageOpenSpecies); }
                alertMessages.push(strings.Follow_NextDataValidationAlertMessagePrompt);
                const alertMessage = alertMessages.join('\n');

                Alert.alert(
                    strings.Follow_NextDataValidationAlertTitle,
                    alertMessage,
                    [
                      {text: strings.Follow_NextDataValidationAlertCancel,
                        onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
                      {text: strings.Follow_NextDataValidationAlertConfirm,
                        onPress: () => this.navigateToFollowTime(nextFollowTime, _.extend(this.state.followArrivals))},
                    ],
                    {cancelable: true}
                );
              } else {
                this.navigateToFollowTime(nextFollowTime, _.extend(this.state.followArrivals))
              }
            }}
            onFoodTrackerSelected={()=>{
              this.updateItemTrackerData(ModalType.food, null);
              this.setModalVisible(true);
            }}

            onSpeciesTrackerSelected={()=>{
              this.updateItemTrackerData(ModalType.species, null);
              this.setModalVisible(true);
            }}

            onSelectActiveFood={(f) => {
              const spaceIndex = f.indexOf(' ');
              const foodName = f.substring(0, spaceIndex);
              const foodPart = f.substring(spaceIndex + 1);
              this.editFood(foodName, foodPart, this.state.activeFood);
            }}

            onSelectFinishedFood={(f) => {
              const spaceIndex = f.indexOf(' ');
              const foodName = f.substring(0, spaceIndex);
              const foodPart = f.substring(spaceIndex + 1);
              this.editFood(foodName, foodPart, this.state.finishedFood);
            }}

            onSelectActiveSpecies={(s) => {
              this.editSpecies(s, this.state.activeSpecies);
            }}

            onSelectFinishedSpecies={(s) => {
              this.editSpecies(s, this.state.finishedSpecies);
            }}
        />

         <FollowArrivalTable
            styles={styles.followArrivalTable}
            chimps={this.props.chimps}
            maleChimpsSorted={this.state.maleChimpsSorted}
            femaleChimpsSorted={this.state.femaleChimpsSorted}
            focalChimpId={this.props.follow.FOL_B_AnimID}
            followDate={this.props.follow.FOL_date}
            followArrivals={this.state.followArrivals}
            selectedChimp={this.state.selectedChimp}
            onSelectChimp={(c) => {this.setState({selectedChimp: c});}}
            createNewArrival={(chimpId, time) => {
              realm.write(() => {
                const newArrival = realm.create('FollowArrival', {
                  date: this.props.follow.FOL_date,
                  followStartTime: this.props.followTime,
                  focalId: this.props.follow.FOL_B_AnimID,
                  chimpId: chimpId,
                  time: time,
                  certainty: parseInt(Util.certaintyLabels.certain),
                  estrus: parseInt(Util.estrusLabels.a),
                  isWithin5m: 'none',
                  isNearestNeighbor: 'none',
                  grooming: 'none'
                });
                let newFollowArrivals = this.state.followArrivals;
                newFollowArrivals[chimpId] = newArrival;
                this.setState({followArrivals: newFollowArrivals});
              });
            }}
            updateArrival={(field, value) => {
              const chimpId = this.state.selectedChimp;
              if (chimpId !== null) {
                console.log("update arrival", chimpId, field, value);
                let arrival = this.state.followArrivals[chimpId];
                realm.write(() => {
                  arrival[field] = value;
                  let newFollowArrivals = this.state.followArrivals;
                  newFollowArrivals[chimpId] = arrival;
                  this.setState({followArrivals: newFollowArrivals});
                  console.log(this.state.followArrivals[chimpId]);
                });
              }
            }}
        />
        <BusyIndicator/>
      </View>
    );
  }
}

const styles = {
  container: {
    width: undefined,
    height: undefined,
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor:'white',
  },
  followScreenHeader: {
    alignSelf: 'stretch',
    paddingLeft: 12,
    paddingRight: 12,
    height: 150,
    backgroundColor: 'pink'
  },
  followArrivalTable: {
    flex: 1,
    height: 200,
    alignSelf: 'stretch'
  },
  btnInGroup: {
    marginRight: 8
  }
};