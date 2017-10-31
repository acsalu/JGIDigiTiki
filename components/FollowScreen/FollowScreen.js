import React, { Component } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
  View
} from 'react-native';
import Orientation from 'react-native-orientation';
import loaderHandler from 'react-native-busy-indicator/LoaderHandler';
import _ from 'lodash';
import realm from '../../models/realm';
import Util from '../util';
import sharedStyles from '../SharedStyles';
import BackgroundTimer from 'react-native-background-timer';

import FollowArrivalTable from './FollowArrivalTable';
import FollowScreenHeader from './FollowScreenHeader';
import ItemTrackerModal from './ItemTrackerModal';

const ModalType = Object.freeze({
  none: 0,
  food: 1,
  species: 2
});

export default class FollowScreen extends Component {

  watchID: ?number = null;

  componentDidMount() {
    Orientation.lockToPortrait();
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  constructor(props) {

    super(props);

    const focalId = this.props.navigation.state.params.follow.focalId;
    const date = this.props.navigation.state.params.follow.date;
    const community = this.props.navigation.state.params.follow.community;
    const followStartTime = this.props.navigation.state.params.followTime;

    const existingLocations = realm.objects('Location')
            .filtered('focalId = $0 AND date = $1',
              focalId, date);

    if (existingLocations.length === 0) {
      this.saveLocation(navigator.geolocation);
      const now = new Date();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const secondsToGo = (15 * 60) - (minutes * 60 + seconds) % (15 * 60);

      const timeoutId = BackgroundTimer.setTimeout(() => {
        const intervalId = BackgroundTimer.setInterval(() => {
          this.saveLocation(navigator.geolocation);
        }, 15 * 60 * 1000);
        realm.write(() => {
          this.props.navigation.state.params.follow.gpsIntervalId = intervalId;
        });
      }, secondsToGo * 1000);

      realm.write(() => {
        this.props.navigation.state.params.follow.gpsFirstTimeoutId = timeoutId;
      });
    }

    if (this.props.followArrivals !== undefined && this.props.followArrivals !== null) {
      // Write follows from previous into db
      console.log("Got follow arrival from previous", this.props.followArrivals);
      realm.write(() => {
        Object.keys(this.props.followArrivals).forEach((key, index) => {
          const fa = this.props.followArrivals[key];

          const followArrivals = realm.objects('FollowArrival')
            .filtered('focalId = $0 AND date = $1 AND followStartTime = $2 AND chimpId = $3',
              focalId, date, followStartTime, fa.chimpId);
          if (followArrivals.length === 0) {
            const newArrival = realm.create('FollowArrival', {
              date: this.props.navigation.state.params.follow.date,
              followStartTime: this.props.followTime,
              focalId: this.props.navigation.state.params.follow.focalId,
              chimpId: fa.chimpId,
              time: fa.time,
              certainty: fa.certainty,
              estrus: fa.estrus,
              isWithin5m: fa.isWithin5m,
              isNearestNeighbor: fa.isNearestNeighbor,
              grooming: fa.grooming
            });
          } else {
            const followArrival = followArrivals[0];
            followArrival.time = fa.time;
            followArrival.certainty = fa.certainty;
            followArrival.estrus = fa.estrus;
            followArrival.isWithin5m = fa.isWithin5m;
            followArrival.isNearestNeighbor = fa.isNearestNeighbor;
            followArrival.grooming = followArrival.grooming;
          }
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
      itemTrackerItemId: null,
      followArrivals: followArrivals,
      selectedChimp: null,
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      maleChimpsSorted: maleChimpsSorted,
      femaleChimpsSorted: femaleChimpsSorted,
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
          itemTrackerItemId: data ? data.id : null,
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
          itemTrackerItemId: data ? data.id : null,
        });
        break;
    }
  }

  editFood(foodId, foodList) {
    const food = foodList.filter((f) => f.id === foodId)[0];
    this.updateItemTrackerData(ModalType.food, food);
    this.setModalVisible(true);
  }

  editSpecies(speciesId, speciesList) {
    const species = speciesList.filter((s) => s.id === speciesId)[0];
    this.updateItemTrackerData(ModalType.species, species);
    this.setModalVisible(true);
  }

  navigateToFollowTime(followTime, followArrivals) {
    if (followArrivals !== null) {
      let updatedFollowArrivals = {};
      const keys = Object.keys(followArrivals);
      for (let i = 0; i < keys.length; ++i) {
        const k = keys[i];
        const fa = followArrivals[k];
        if (fa.time.startsWith('arrive')) {
          let newFa = _.extend({}, fa);
          newFa.time = 'arriveContinues';
          newFa.isWithin5m = false;
          newFa.isNearestNeighbor = false;
          newFa.grooming = 'N';
          newFa.certainty = Util.getCertaintyLabelWithoutNesting(newFa.certainty);
          updatedFollowArrivals[k] = newFa;
        }

        this.props.navigator.replace({
          id: 'FollowScreen',
          follow: this.props.navigation.state.params.follow,
          followTime: followTime,
          followArrivals: updatedFollowArrivals
        });
      }
    } else {
      this.props.navigator.replace({
        id: 'FollowScreen',
        follow: this.props.navigation.state.params.follow,
        followTime: followTime
      });
    }
  }

  presentEndFollowAlert() {
    const strings = this.props.screenProps.localizedStrings;
    Alert.alert(
        strings.Follow_EndFollowAlertTitle,
        strings.Follow_EndFollowAlertMessage,
        [
          {text: strings.Follow_EndFollowActionNo, onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
          {text: strings.Follow_EndFollowActionYes, onPress: this.endFollow.bind(this)}
        ],
        { cancelable: false }
      );
  }

  endFollow() {
    realm.write(() => {
      this.props.navigation.state.params.follow.endTime = this.props.followTime;
    });
    if (this.props.navigation.state.params.follow.gpsFirstTimeoutId !== undefined) {
      console.log("stop gps timeout");
      BackgroundTimer.clearTimeout(this.props.navigation.state.params.follow.gpsFirstTimeoutId);
    }
    if (this.props.navigation.state.params.follow.gpsIntervalId !== undefined) {
      console.log("stop gps interval timer");
      BackgroundTimer.clearInterval(this.props.navigation.state.params.follow.gpsIntervalId);
    }

    // Go back to Menu
    this.props.navigator.pop();
  }

  saveLocation(geolocation) {
    const focalId = this.props.navigation.state.params.follow.focalId;
    const date = this.props.navigation.state.params.follow.date;
    const community = this.props.navigation.state.params.follow.community;
    const followStartTime = this.props.followTime;

    geolocation.getCurrentPosition(
        (position) => {
          realm.write(() => {
            const newLocation = realm.create('Location', {
              date: date,
              focalId: focalId,
              followStartTime: followStartTime,
              community: community,
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

  render() {
    const strings = this.props.screenProps.localizedStrings;
    const beginFollowTime = this.props.navigation.state.params.follow.startTime;
    const beginFollowTimeIndex = this.props.screenProps.times.indexOf(beginFollowTime);
    const followTimeIndex = this.props.screenProps.times.indexOf(this.props.followTime);
    const previousFollowTime = followTimeIndex !== beginFollowTimeIndex ? this.props.screenProps.times[followTimeIndex - 1] : null;
    const nextFollowTime = followTimeIndex !== this.props.screenProps.times.length - 1 ? this.props.screenProps.times[followTimeIndex + 1] : null;

    return(
      <View style={styles.container}>

        <ItemTrackerModal
            title={this.state.modalMainList == this.props.food ? "Food" : "Species"}
            strings={strings}
            visible={this.state.modalVisible}
            mainList={this.state.modalMainList}
            secondaryList={this.state.modalSubList}
            beginFollowTime={this.props.followTime}
            initialStartTime={this.state.itemTrackerInitialStartTime}
            initialEndTime={this.state.itemTrackerInitialEndTime}
            initialMainSelection={this.state.itemTrackerInitialMainSelection}
            initialSecondarySelection={this.state.itemTrackerInitialSecondarySelection}
            itemId={this.state.itemTrackerItemId}
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
                    date: this.props.navigation.state.params.follow.date,
                    focalId: this.props.navigation.state.params.follow.focalId,
                    startTime: data.startTime,
                    endTime: data.endTime,
                    id: new Date().getUTCMilliseconds()
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
                  let object = newActiveList.filter((o) => o.id === data.itemId)[0];
                  object.startTime = data.startTime;
                  object.endTime = data.endTime;
                  object[mainFieldName] = data.mainSelection;
                  object[secondaryFieldName] = data.secondarySelection;

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

        <View style={styles.mainMenu}>
          <Button
            style={[sharedStyles.btn, sharedStyles.btnSpecial, {marginRight: 8}]}
            onPress={()=>{
              this.props.navigator.replace({
                id: 'SummaryScreen',
                follow: this.props.follow
              });
            }} title={strings.Follow_SeeSummaryButtonTitle}>
          </Button>
          <Button
            style={[sharedStyles.btn, sharedStyles.btnSpecial]}
            onPress={this.presentEndFollowAlert.bind(this)} title={strings.Follow_EndFollowButtonTitle} >

          </Button>
        </View>

        <FollowScreenHeader
            styles={styles.followScreenHeader}
            strings={strings}
            follow={this.props.follow}
            followTime={this.props.followTime}
            activeFood={this.state.activeFood.map((f, i) => {return {id: f.id, name: f.foodName + ' ' + f.foodPart}})}
            finishedFood={this.state.finishedFood.map((f, i) => ({id: f.id, name: f.foodName + ' ' + f.foodPart}))}
            activeSpecies={this.state.activeSpecies.map((s, i) => ({id: s.id, name: s.speciesName}))}
            finishedSpecies={this.state.finishedSpecies.map((s, i) => ({id: s.id, name: s.speciesName}))}
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

            onSelectActiveFood={(fid) => {
              this.editFood(fid, this.state.activeFood);
            }}

            onSelectFinishedFood={(fid) => {
              if (fid === null) { return; }
              this.editFood(fid, this.state.finishedFood);
            }}

            onSelectActiveSpecies={(sid) => {
              this.editSpecies(sid, this.state.activeSpecies);
            }}

            onSelectFinishedSpecies={(sid) => {
              if (sid === null) { return; }
              this.editSpecies(sid, this.state.finishedSpecies);
            }}
        />

         <FollowArrivalTable
            styles={styles.followArrivalTable}
            chimps={this.props.chimps}
            maleChimpsSorted={this.state.maleChimpsSorted}
            femaleChimpsSorted={this.state.femaleChimpsSorted}
            focalChimpId={this.props.navigation.state.params.follow.focalId}
            followDate={this.props.navigation.state.params.follow.date}
            followArrivals={this.state.followArrivals}
            selectedChimp={this.state.selectedChimp}
            onSelectChimp={(c) => {this.setState({selectedChimp: c});}}
            createNewArrival={(chimpId, time) => {
              realm.write(() => {
                const newArrival = realm.create('FollowArrival', {
                  date: this.props.navigation.state.params.follow.date,
                  followStartTime: this.props.followTime,
                  focalId: this.props.navigation.state.params.follow.focalId,
                  chimpId: chimpId,
                  time: time,
                  certainty: parseInt(Util.certaintyLabels.certain),
                  estrus: parseInt(Util.estrusLabels.a),
                  isWithin5m: false,
                  isNearestNeighbor: false,
                  grooming: 'N'
                });
                let newFollowArrivals = this.state.followArrivals;
                newFollowArrivals[chimpId] = newArrival;
                this.setState({followArrivals: newFollowArrivals});
              });
            }}
            updateArrival={(field, value) => {
              const chimpId = this.state.selectedChimp;
              if (chimpId !== null) {
                let arrival = this.state.followArrivals[chimpId];
                realm.write(() => {
                  arrival[field] = value;
                  let newFollowArrivals = this.state.followArrivals;
                  newFollowArrivals[chimpId] = arrival;
                  this.setState({followArrivals: newFollowArrivals});
                });
              }
            }}
        />
        <ActivityIndicator/>
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
  mainMenu: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    paddingTop: 6,
    paddingBottom: 6,
    marginLeft: 12,
    marginRight: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'gray',
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
