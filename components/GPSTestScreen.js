import React, { Component } from 'react';
import {
  Button,
  Text,
  View
} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';

export default class GPSTestScreen extends Component {

  constructor(props) {
    super(props);

    this.state = {
      geolocationHistory: [],
      lastGPSrecordDateTime: '-',
      currentGeolocation: [0, 0],
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      timerTimeout: 0,
      timerInterval: 5*1000, // 15*60*1000
    }
  }

  componentDidMount() {
    this.restartTimer();
  }

  getGPSnow() {
    console.log("Get GPS now");
    var timeout = this.state.timerInterval;

    navigator.geolocation.getCurrentPosition((position) => {
      const dateTime = new Date();
      var dateTimeString = dateTime.getHours().toString() + 'H :' + dateTime.getMinutes().toString() + 'M: ' + dateTime.getSeconds().toString() + 'S';

      this.setState({ lastGPSrecordDateTime: dateTimeString })
      this.setState({ currentGeolocation: [position.coords.longitude, position.coords.latitude] });
      this.setState({ geolocationHistory: [...this.state.geolocationHistory, [position.coords.longitude, position.coords.latitude]]});
    }, (error) => {
      this.setState({ currentGeolocation: ['x', 'x']});
    },
    { enableHighAccuracy: true, timeout: timeout });
  }

  changeGPSInterval(interval) {
    console.log("GPS Timer Interval: ", interval);
    this.setState({ timerInterval: interval*1000 });
    this.setState({ timerTimeout: interval*1000 });
    this.restartTimer();
  }

  restartTimer() {
    console.log("Timer started for: ", this.state.timerInterval);
    this.setState({ timerTimeout: this.state.timerInterval });
    this.getGPSnow();

    BackgroundTimer.setInterval(() => {
      this.getGPSnow();
    },
    this.state.timerInterval);
  }

  render() {
    return(
      <View>
        <Button title="Get GPS now" onPress={() =>   this.getGPSnow() }></Button>
        <Text>Last location recorded at: { this.state.lastGPSrecordDateTime }</Text>
        <Text>Lat: { this.state.currentGeolocation[0] } </Text>
        <Text>Lat: { this.state.currentGeolocation[1] } </Text>
        <Text>GPS Location Interval: { this.state.timerInterval / 1000 } sec</Text>
        <Button title="Get location every 5 seconds" onPress={() => this.changeGPSInterval(5)}></Button>
        <Button title="Get location every 5 minutes" onPress={() => this.changeGPSInterval(5*60)}></Button>
        <Button title="Get location every 5 minutes" onPress={() => this.changeGPSInterval(15*60)}></Button>
        <Text>{ this.state.geolocationHistory }</Text>
      </View>
    )
  }

}

const styles = {
}
