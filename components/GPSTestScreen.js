import React, { Component } from 'react';
import {
  Button,
  Text,
  View
} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';

export default class GPSTestScreen extends Component {

  intervalId: ?number = null;
  watchId: ?number = null;
  watchId2: ?number = null;
  watchId3: ?number = null;

  constructor(props) {
    super(props);

    this.state = {
      geolocationHistory: [],
      geolocationHistory2: [],
      geolocationHistory3: [],
      lastGPSrecordDateTime: '-',
      currentGeolocation: [0, 0],
      initialPosition: 'unknown',
      lastPosition: 'unknown',
      timerTimeout: 0,
      timerInterval: 60*1000, // 15*60*1000
    }
  }

  componentDidMount() {
    this.restartTimer();
  }

  componentWillUnmount() {
    BackgroundTimer.clearInterval(intervalId);
    navigator.geolocation.clearWatch(watchId);
  }

  getGPSnow() {
    var timeout = this.state.timerInterval;

    watchId = navigator.geolocation.getCurrentPosition((position) => {
      console.log("Got GPS position")
      const dateTime = new Date();
      var dateTimeString = dateTime.getHours().toString() + 'H :' + dateTime.getMinutes().toString() + 'M: ' + dateTime.getSeconds().toString() + 'S';

      this.setState({ lastGPSrecordDateTime: dateTimeString })
      this.setState({ currentGeolocation: [position.coords.longitude, position.coords.latitude] });
      this.setState({ geolocationHistory: [...this.state.geolocationHistory, [position.coords.longitude, position.coords.latitude]]});
    }, (error) => {
      switch(error.code) {
        case error.TIMEOUT:
            console.log("Couldn't get lock");
            this.setState({ currentGeolocation: ['x', 'x']});
            this.getGPSnow();
            break;
        default:
            this.getGPSnow();
            //alert(JSON.stringify(error));
      }
    },
    {
      enableHighAccuracy: true, // FINE_LOCATION
      timeout: 2*60*1000, // wait for signal for 2 minutes, then call ErrorCallback
      maximumAge: 2*60*1000
    }
  );
  }

  getGPSnow2() {
    var timeout = this.state.timerInterval;

    watchId2 = navigator.geolocation.getCurrentPosition((position) => {
      console.log("Got GPS position")
      const dateTime = new Date();
      var dateTimeString = dateTime.getHours().toString() + 'H :' + dateTime.getMinutes().toString() + 'M: ' + dateTime.getSeconds().toString() + 'S';

      this.setState({ geolocationHistory2: [...this.state.geolocationHistory2, [position.coords.longitude, position.coords.latitude]]});
    }, (error) => {
      switch(error.code) {
        case error.TIMEOUT:
            console.log("Couldn't get lock");
            this.getGPSnow2();
            break;
        default:
            this.getGPSnow2();
            //alert(JSON.stringify(error));
      }
    },
    {
      enableHighAccuracy: true, // FINE_LOCATION
    }
  );
  }

  getGPSnow3() {
    var timeout = this.state.timerInterval;

    watchId3 = navigator.geolocation.getCurrentPosition((position) => {
      console.log("Got GPS position")
      const dateTime = new Date();
      var dateTimeString = dateTime.getHours().toString() + 'H :' + dateTime.getMinutes().toString() + 'M: ' + dateTime.getSeconds().toString() + 'S';

      this.setState({ geolocationHistory3: [...this.state.geolocationHistory3, [position.coords.longitude, position.coords.latitude]]});
    }, (error) => {
      switch(error.code) {
        case error.TIMEOUT:
            console.log("Couldn't get lock");
            this.getGPSnow3();
            break;
        default:
            this.getGPSnow3();
            //alert(JSON.stringify(error));
      }
    },
    {
      enableHighAccuracy: true, // FINE_LOCATION
      timeout: 2*60*1000
    }
  );
  }

  changeGPSInterval(interval) {
    console.log("GPS Timer Interval: ", interval);
    this.setState({ timerInterval: interval*1000 });
    this.setState({ timerTimeout: interval*1000 });
    BackgroundTimer.clearInterval(intervalId);
    this.restartTimer();
  }

  restartTimer() {
    console.log("Timer started for: ", this.state.timerInterval);
    this.getGPSnow();
    this.getGPSnow2();
    this.getGPSnow3();
    const interval = this.state.timerInterval;
    intervalId = BackgroundTimer.setInterval(() => {
      this.getGPSnow();
      this.getGPSnow2();
      this.getGPSnow3();
      if(this.state.timerInterval != interval) {
          BackgroundTimer.clearInterval(intervalId);
          this.restartTimer();
      }
    }, this.state.timerInterval);
  }

  render() {
    return(
      <View>
        <Button title="Get GPS now" onPress={() => this.getGPSnow() }></Button>
        <Text>Last location recorded at: { this.state.lastGPSrecordDateTime }</Text>
        <Text>Lat: { this.state.currentGeolocation[0] } </Text>
        <Text>Lat: { this.state.currentGeolocation[1] } </Text>
        <Text>GPS Location Interval: { this.state.timerInterval / 1000 } sec</Text>
        <Button title="Get location every 5 seconds" onPress={() => this.changeGPSInterval(5)}></Button>
        <Button title="Get location every 5 minutes" onPress={() => this.changeGPSInterval(5*60)}></Button>
        <Button title="Get location every 15 minutes" onPress={() => this.changeGPSInterval(15*60)}></Button>
        <Text>{ this.state.geolocationHistory } {"\n\n"}
        { this.state.geolocationHistory2 } {"\n\n"}
        { this.state.geolocationHistory3 } {"\n\n"}</Text>
      </View>
    )
  }

}

const styles = {
}
