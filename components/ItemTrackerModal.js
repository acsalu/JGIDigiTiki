import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Modal,
  Picker,
  View
} from 'react-native';
import Button from 'react-native-button';
import util from './util';
import strings from '../data/strings';

export default class ItemTrackerModal extends Component {

  state = {
    startTime: this.props.startTime,
    endTime: this.props.endTime,
    mainSelection: this.props.mainSelection,
    secondarySelection: this.props.secondarySelection,
    isEditing: this.props.startTime !== null
  };

  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    // if (nextProps.startTime !== this.state.startTime) {
    //   this.setState({ startTime: nextProps.startTime });
    //
    this.setState({
      startTime: nextProps.initialStartTime,
      endTime: nextProps.initialEndTime,
      mainSelection: nextProps.initialMainSelection,
      secondarySelection: nextProps.initialSecondarySelection,
      isEditing: nextProps.initialStartTime !== null
    });
  }

  render() {

    const mainPickerItems = this.props.mainList.map((e, i) => {
      return (<Picker.Item key={i} label={e[1]} value={e[0]} />);
    });

    const secondaryPickerItems = this.props.secondaryList.map((e, i) => {
      return (<Picker.Item key={i} label={e[1]} value={e[0]} />);
    });

    let timePickerItems = util.getTrackerTimes(util.dbTime2UserTime(this.props.beginFollowTime))
        .map((e, i) => {
          return (<Picker.Item key={i} label={e} value={e} />);
        });
    timePickerItems.unshift((<Picker.Item key={-1} label={strings.TimeFormat} value='ongoing' />));

    return (
        <Modal
            animationType={"slide"}
            transparent={false}
            visible={this.props.visible}
            onRequestClose={() => {alert("Modal has been closed.")}}
        >
          <View style={{marginTop: 22}}>
            <View style={styles.followScreenHeaderInfoRow}>
              <Button
                  style={styles.btn}
                  styleDisabled={{opacity: 0.5}}
                  disabled={
                    [this.state.mainSelection, this.state.secondarySelection, this.state.startTime]
                        .some(x => x === null) || (this.state.endTime !== 'ongoing' && this.state.endTime < this.state.startTime)
                  }
                  onPress={() => {
                    const data = {
                      mainSelection: this.state.mainSelection,
                      secondarySelection: this.state.secondarySelection,
                      startTime: this.state.startTime,
                      endTime: this.state.endTime !== null ? this.state.endTime : 'ongoing'
                    };
                    this.props.onSave(data, this.state.isEditing);
                    this.props.onDismiss();
                  }}>
                {strings.ItemTracker_Save}
              </Button>

              <Text style={styles.followScreenHeaderMainText}>
                {this.props.title}
              </Text>

              <Button
                  style={styles.btn}
                  onPress={() => {
                    this.props.onDismiss();
                  }}>
                {strings.ItemTracker_Cancel}
              </Button>
            </View>

            <View>
              <Picker
                  selectedValue={this.state.startTime}
                  onValueChange={(v)=>{this.setState({startTime: v})}}
                  style={{}}
              >
                {timePickerItems}
              </Picker>
              <Text style={{textAlign: 'center'}}>hadi</Text>
              <Picker
                  selectedValue={this.state.endTime}
                  onValueChange={(v)=>{this.setState({endTime: v})}}
                  style={{}}
              >
                {timePickerItems}
              </Picker>
            </View>

            <Picker
                selectedValue={this.state.mainSelection}
                onValueChange={(v)=>{this.setState({mainSelection: v})}}>
              {mainPickerItems}
            </Picker>

            <Picker
                selectedValue={this.state.secondarySelection}
                onValueChange={(v)=>{this.setState({secondarySelection: v})}}>
              {secondaryPickerItems}
            </Picker>
          </View>
        </Modal>
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