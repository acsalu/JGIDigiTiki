import React, { Component } from 'react';
import {
  Alert,
  AppRegistry,
  DatePickerAndroid,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  Modal,
  Navigator,
  Picker,
  View
} from 'react-native';
import FollowArrivalTable from '../FollowArrivalTable';
import ItemTrackerModal from './ItemTrackerModal';
import FollowScreenHeader from './FollowScreenHeader';
import Util from '../util';

import realm from '../../models/realm';
import strings from '../../data/strings';
import _ from 'lodash';

const ModalType = Object.freeze({
  none: 0,
  food: 1,
  species: 2
});

export default class FollowScreen extends Component {

  constructor(props) {
    super(props);

    const focalId = this.props.follow.FOL_B_AnimID;
    const date = this.props.follow.FOL_date;

    console.log(this.props.followArrivals);
    console.log(this.props.followTime);
    console.log(this.props.follow);
    console.log(this.props.abc);

    let followArrivals = null;
    if (this.props.followArrivals !== undefined && this.props.followArrivals !== null) {
      followArrivals = this.props.followArrivals;
    } else {
      followArrivals = {};
      // Populate followArrival in db
      const allFollowArrival = realm.objects('FollowArrival')
          .filtered('focalId = $0 AND date = $1 AND followStartTime = $2', focalId, date, this.props.followTime);
      for (let i = 0; i < allFollowArrival.length; i++) {
        const arrival = allFollowArrival[i];
        followArrivals[arrival.chimpId] = arrival;
      }
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
      selectedChimp: null
    };
  };

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

  editFood(foodName, foodPart) {
    const food = this.state.activeFood.filter((f) => f.foodName === foodName && f.foodPart === foodPart)[0];
    this.updateItemTrackerData(ModalType.food, food);
    this.setModalVisible(true);
  }

  editSpecies(speciesName) {
    const species = this.state.activeSpecies.filter((s) => s.speciesName === speciesName)[0];
    this.updateItemTrackerData(ModalType.species, species);
    this.setModalVisible(true);
  }

  navigateToFollowTime(followTime, followArrivals) {
    console.log("navigateToFollowTime", followArrivals);
    this.props.navigator.push({
      id: 'FollowScreen',
      follow: this.props.follow,
      followTime: followTime,
      followArrivals: followArrivals
    });
  }

  render() {
    const beginFollowTime = this.props.follow.FOL_time_begin;
    const beginFollowTimeIndex = this.props.times.indexOf(beginFollowTime);
    const followTimeIndex = this.props.times.indexOf(this.props.followTime);
    const previousFollowTime = followTimeIndex !== beginFollowTimeIndex ? this.props.times[followTimeIndex - 1] : null;
    const nextFollowTime = followTimeIndex !== this.props.times.length - 1 ? this.props.times[followTimeIndex + 1] : null;

    return(
      <View>

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
              this.editFood(foodName, foodPart);
            }}

            onSelectFinishedFood={(f) => {
            }}

            onSelectActiveSpecies={(s) => {
              this.editSpecies(s);
            }}

            onSelectFinishedSpecies={(s) => {
            }}
        />

         <FollowArrivalTable
            chimps={this.props.chimps}
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
                  isWithin5m: false,
                  isNearestNeighbor: false
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
      </View>
    );
  }
}

const styles = {
  followScreenHeader: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 150,
    paddingLeft: 12,
    paddingRight: 12
  },
  followScreenHeaderInfoRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    alignItems: 'center',
    height: 40,
    paddingLeft: 12,
    paddingRight: 12
  },
  headerRow: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    alignItems: 'center',
    height: 50,
  },
  followScreenHeaderMainText: {
    fontSize: 34,
    color: '#000'
  },
  btn: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#33b5e5',
    borderRadius: 3
  },
  btnInGroup: {
    marginRight: 8
  }
};