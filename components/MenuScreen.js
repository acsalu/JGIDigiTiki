import React, { Component } from 'react';
import {
  AppRegistry,
  Dimensions,
  Image,
  StyleSheet,
  TouchableHighlight,
  Text,
  TextInput,
  Navigator,
  View
} from 'react-native';
import Button from 'react-native-button';

export default class MenuScreen extends Component {

  render() {
    return(
      <Image source={require('../img/chimp.png')} style={styles.container}>
        <Text style={styles.header}>Jane Goodall Institute</Text>
        <Text style={styles.description}>Fuata</Text>

        <Button
            onPress={() => {this.props.navigator.push({id: 'NewFollowScreen'});}}
            style={styles.btn}
        >
          Anza ufuataji
        </Button>

        <Button
            onPress={() => {this.props.navigator.push({id: 'FollowListScreen'});}}
            style={styles.btn}
        >
          Endelea kufuata
        </Button>

        <Button
            onPress={() => {}}
            style={styles.btn}>
          Endelea na ufuataji ulipoachia
        </Button>



      </Image>
    );
  }
}

var styles = {
  container: {
    flex: 1,
    width: undefined,
    height: undefined,
    backgroundColor:'white',
    alignItems: 'center',
    resizeMode: Image.resizeMode.contain
  },
  header: {
    alignSelf: "stretch",
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    fontSize: 18,
    textAlign: 'left',
    backgroundColor: '#ececec',
    color: 'black'
  },
  description: {
    alignSelf: 'stretch',
    marginTop: 100,
    marginBottom: 30,
    fontSize: 44,
    textAlign: 'center',
    lineHeight: 40,
    color: 'black'
  },
  btn: {
    width: 500,
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 14,
    color: '#fff',
    backgroundColor: '#33b5e5'
  }
};