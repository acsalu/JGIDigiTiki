import React, { Component } from 'react';
import {
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
import ItemTrackerModal from '../ItemTrackerModal';
import FollowScreenHeader from './FollowScreenHeader';

import realm from '../../models/realm';

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

    // Populate food in db
    const allFood = realm.objects('Food').filtered('focalId = $0 AND date = $1', focalId, date);

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
    const allSpecies = realm.objects('Species').filtered('focalId = $0 AND date = $1', focalId, date);

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
      itemTrackerInitialSecondarySelection: null
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
            beginFollowTime={beginFollowTime}
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
              this.props.navigator.replace({
                  id: 'FollowScreen',
                  follow: this.props.follow,
                  followTime: previousFollowTime
                });
            }}
            onNextPress={()=>{
              this.props.navigator.replace({
                  id: 'FollowScreen',
                  follow: this.props.follow,
                  followTime: nextFollowTime
                });
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