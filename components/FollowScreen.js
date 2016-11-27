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
import util from './util';

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
  };

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    const beginFollowTime = this.props.follow.FOL_time_begin;
    const beginFollowTimeIndex = this.props.times.indexOf(beginFollowTime);
    const followTimeIndex = this.props.times.indexOf(this.props.followTime);
    const previousFollowTime = followTimeIndex !== beginFollowTimeIndex ? this.props.times[followTimeIndex - 1] : null;
    const nextFollowTime = followTimeIndex !== this.props.times.length - 1 ? this.props.times[followTimeIndex + 1] : null;

    const modalMainPickerItems = this.state.modalMainList.map((e, i) => {
      return (<Picker.Item key={i} label={e[1]} value={e[0]} />);
    });

    const modalSubPickerItems = this.state.modalSubList.map((e, i) => {
      return (<Picker.Item key={i} label={e[1]} value={e[0]} />);
    });

    const timePickerItems = util.getTrackerTimes(
        util.dbTime2UserTime(beginFollowTime)).map((e, i) => {
      return (<Picker.Item key={i} label={e} value={e} />);
    });

    return(
      <View>
        <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {alert("Modal has been closed.")}}
        >
          <View style={{marginTop: 22}}>
              <View style={styles.followScreenHeaderInfoRow}>
                <Button
                    style={styles.btn}
                    onPress={() => {
                  this.setModalVisible(!this.state.modalVisible)
                }}>
                  Kubari (Save)
                </Button>

                <Text style={styles.followScreenHeaderMainText}>
                  {this.state.modalMainList == this.props.food ? "Food" : "Species"}
                </Text>

                <Button
                    style={styles.btn}
                    onPress={() => {
                  this.setModalVisible(!this.state.modalVisible)
                }}>
                  Hapana (Cancel)
                </Button>
              </View>

              <Picker>{timePickerItems}</Picker>
              <Text>hadi</Text>
              <Picker>{timePickerItems}</Picker>

              <Picker
                  selectedValue={this.state.selectedFood}
                  onValueChange={(v)=>{this.setState({selectedFood: v})}}>
                {modalMainPickerItems}
              </Picker>

              <Picker
                  selectedValue={this.state.selectedFoodPart}
                  onValueChange={(v)=>{this.setState({selectedFoodPart: v})}}>
                {modalSubPickerItems}
              </Picker>
          </View>
        </Modal>

        <FollowScreenHeader
            follow={this.props.follow}
            followTime={this.props.followTime}
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
              this.setState({
                modalMainList: this.props.food,
                modalSubList: this.props.foodParts
              });
              this.setModalVisible(true);
            }}

            onSpeciesTrackerSelected={()=>{
              this.setState({
                modalMainList: this.props.species,
                modalSubList: this.props.speciesNumbers
              });
              this.setModalVisible(true);
            }}
        />
        <FollowArrivalTable
            chimps={this.props.chimps}
            focalChimpId={this.props.follow.FOL_B_AnimID}
            followDate={this.props.follow.FOL_date}
            activeFood={this.state.activeFood}
            finishedFood={this.state.finishedFood}
            activeSpecies={this.state.activeSpecies}
            finishedSpecies={this.state.finishedSpecies}
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
              activeListTitle='Active Food'
              finishedListTitle='Finished Food'
              activeItems={this.props.activeFood}
              finishedItems={this.props.finishedFood}
              onTrigger={this.props.onFoodTrackerSelected}
          />
          <ItemTracker
              title='Species'
              activeListTitle='Active Species'
              finishedListTitle='Finished Species'
              activeItems={this.props.activeSpecies}
              finishedItems={this.props.finishedSpecies}
              onTrigger={this.props.onSpeciesTrackerSelected}
          />
        </View>
    );
  }
}

class ItemTracker extends Component {
  render() {
    return (
        <View style={styles.headerRow}>
          <Button
              style={styles.btn}
              onPress={()=>{this.props.onTrigger();}}>{this.props.title}</Button>
          <Button
              style={styles.btn}
          >{this.props.activeListTitle}</Button>
          <Button
              style={styles.btn}
          >{this.props.finishedListTitle}</Button>
        </View>
    )
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
    fontSize: 20,
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
};