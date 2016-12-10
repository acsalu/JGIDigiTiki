import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Modal,
  Picker,
  View
} from 'react-native';
import Button from 'react-native-button';

export default class ItemTracker extends Component {
  state = {
    dummyActiveItem: null,
    dummyFinishedItem: null
  };

  render() {

    const activePickerItems = [this.props.activeListTitle].concat(this.props.activeItems)
        .map((name, i) => {
          return (<Picker.Item key={i} label={name} value={i !== 0 ? name : null} />);
        });

    const finishedPickerItems = [this.props.finishedListTitle].concat(this.props.finishedItems)
        .map((name, i) => {
          return (<Picker.Item key={i} label={name} value={i !== 0 ? name : null} />);
        });

    return (
        <View style={styles.row}>
          <Button
              style={styles.btn}
              onPress={()=>{this.props.onTrigger();}}>{this.props.title}</Button>

          <Picker style={styles.picker}
                  onValueChange={(v) => {
                    if (v !== null) {
                      this.props.onSelectActiveItem(v);
                    }
                  }}
                  selectedValue={this.state.dummyActiveItem}
          >
            {activePickerItems}
          </Picker>

          <Picker style={styles.picker}
                  onValueChange={(v) => {this.props.onSelectFinishedItem(v);}}
                  selectedValue={this.state.dummyFinishedItem}
          >
            {finishedPickerItems}
          </Picker>

        </View>
    )
  }
}

const styles = {
  row: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignSelf: 'stretch',
    alignItems: 'center',
    height: 50,
  },
  picker: {
    width: 200,
    height: 35
  },
  btn: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#33b5e5',
    borderRadius: 3,
    marginRight: 8
  }
};