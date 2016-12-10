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
import Button from 'react-native-button';
import FollowArrivalTable from './FollowArrivalTable';
import ItemTracker from './ItemTracker';
import ItemTrackerModal from './ItemTrackerModal';

import util from './util';
import realm from '../models/realm';

const ModalType = Object.freeze({
  none: 0,
  food: 1,
  species: 2
});

export default class FollowScreen extends Component {

  state = {
    modalVisible: false,
    activeFood: [],
    finishedFood: [],
    activeSpecies: [],
    finishedSpecies: [],
    selectedFood: null,
    selectedFoodPart: null,
    modalMainList: [],
    modalSubList: [],
    modalType: ModalType.none,
    itemTrackerData: null
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  setItemTrackerData(data) {
    this.setState({itemTrackerData: data});
  }

  setModalType(type) {
    switch (type) {
      case ModalType.food:
        this.setState({
          modalMainList: this.props.food,
          modalSubList: this.props.foodParts,
        });
        break;
      case ModalType.species:
        this.setState({
          modalMainList: this.props.species,
          modalSubList: this.props.speciesNumbers
        });
        break;
    }

    this.setState({
      modalType: type
    });
  }

  editFood(foodName, foodPart) {
    const food = this.state.activeFood.filter((f) => f.foodName === foodName && f.foodPart === foodPart)[0];
    this.setItemTrackerData(food);
    this.setModalVisible(true);
  }

  editSpecies(speciesName) {
    const species = this.state.activeSpecies.filter((s) => s.speciesName === speciesName)[0];
    this.setItemTrackerData(species);
    this.setModalVisible(true);
  }

  render() {
    const beginFollowTime = this.props.follow.FOL_time_begin;
    const beginFollowTimeIndex = this.props.times.indexOf(beginFollowTime);
    const followTimeIndex = this.props.times.indexOf(this.props.followTime);
    const previousFollowTime = followTimeIndex !== beginFollowTimeIndex ? this.props.times[followTimeIndex - 1] : null;
    const nextFollowTime = followTimeIndex !== this.props.times.length - 1 ? this.props.times[followTimeIndex + 1] : null;

    console.log(this.state.itemTrackerData);
    console.log(this.state.activeFood);
    console.log(this.state.finishedFood);

    return(
      <View>

        <ItemTrackerModal
            title={this.state.modalMainList == this.props.food ? "Food" : "Species"}
            visible={this.state.modalVisible}
            mainList={this.state.modalMainList}
            secondaryList={this.state.modalSubList}
            beginFollowTime={beginFollowTime}
            data={this.state.itemTrackerData}
            startTime={this.state.itemTrackerData !== null ? this.state.itemTrackerData.startTime : null}
            endTime={this.state.itemTrackerData !== null ? this.state.itemTrackerData.endTime : null}
            mainSelection={
              this.state.itemTrackerData !== null && this.state.modalType !== ModalType.none ?
                (this.state.modalType !== ModalType.food ? this.state.itemTrackerData.foodName : this.state.itemTrackerData.speciesName) : null
            }
            secondarySelection={
              this.state.itemTrackerData !== null && this.state.modalType !== ModalType.none ?
                  (this.state.modalType !== ModalType.food ? this.state.itemTrackerData.foodPart : this.state.itemTrackerData.speciesCount) : null
            }
            onDismiss={()=>{this.setModalVisible(false)}}
            onSave={(data)=>{
              realm.write(() => {
                if (this.state.modalType === ModalType.food) {
                  const newFood = realm.create('Food', {
                    date: this.props.follow.FOL_date,
                    focalId: this.props.follow.FOL_B_AnimID,
                    foodName: data.mainSelection,
                    foodPart: data.secondarySelection,
                    startTime: data.startTime,
                    endTime: data.endTime
                  });

                  if (data.endTime === 'ongoing') {
                    let newActiveFood = this.state.activeFood;
                    newActiveFood.push(newFood);
                    this.setState({activeFood: newActiveFood});
                  } else {
                    let newFinishedFood = this.state.finishedFood;
                    newFinishedFood.push(newFood);
                    this.setState({finishedFood: newFinishedFood});
                  }
                } else if (this.state.modalType === ModalType.species) {
                  const newSpecies = realm.create('Species', {
                    date: this.props.follow.FOL_date,
                    focalId: this.props.follow.FOL_B_AnimID,
                    speciesName: data.mainSelection,
                    speciesCount: data.secondarySelection,
                    startTime: data.startTime,
                    endTime: data.endTime
                  });
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
              this.setModalType(ModalType.food);
              this.setItemTrackerData(null);
              this.setModalVisible(true);
            }}

            onSpeciesTrackerSelected={()=>{
              this.setModalType(ModalType.species);
              this.setItemTrackerData(null);
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

class FollowScreenHeader extends Component {
  render() {
    const isFirstFollow = this.props.followTime === this.props.follow.FOL_time_begin;

    return (
        <View style={styles.followScreenHeader}>
          <View style={styles.followScreenHeaderInfoRow}>
            <Button
                style={[{opacity: (isFirstFollow ? 0.0 : 1.0)}, styles.btn]}
                onPress={this.props.onPreviousPress}
                disabled={isFirstFollow}
            >
              Iliyopita
            </Button>
            <Text style={styles.followScreenHeaderMainText}>
              {util.dbTime2UserTime(this.props.followTime)}
            </Text>
            <Button
                style={styles.btn}
                onPress={this.props.onNextPress}
            >
              Inayofuata
            </Button>
          </View>
          <ItemTracker
              title='Food'
              activeListTitle='Active'
              finishedListTitle='Finished'
              activeItems={this.props.activeFood}
              finishedItems={this.props.finishedFood}
              onTrigger={this.props.onFoodTrackerSelected}
              onSelectActiveItem={this.props.onSelectActiveFood}
              onSelectFinishedItem={this.props.onSelectFinishedFood}
          />
          <ItemTracker
              title='Species'
              activeListTitle='Active'
              finishedListTitle='Finished'
              activeItems={this.props.activeSpecies}
              finishedItems={this.props.finishedSpecies}
              onTrigger={this.props.onSpeciesTrackerSelected}
              onSelectActiveItem={this.props.onSelectActiveSpecies}
              onSelectFinishedItem={this.props.onSelectFinishedSpecies}
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