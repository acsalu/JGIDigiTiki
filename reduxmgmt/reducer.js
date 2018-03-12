//import state from './state';
const initialState = {
  count: 0,
  gpsTrackerOn: false,
  gpsTimerInterval: 15*60*1000, // save in constants.js
  gpsStatus: 'Not found',
  lastGpsPosition: null, // position.timestamp, position.coords.latitude, longitude, altitude, accuracy
};

// REDUCERS
export default (state = initialState, action) => {
  switch (action.type) {
    case 'INCREMENT':
      return {
        ...state,
        count: state.count + 1
      };
    case 'DECREMENT':
      return {
        ...state,
        count: state.count - 1
      };
    case 'RESET':
      return {
        ...state,
        count: 0
      };
    case 'TRACK_GPS':
      return {
        ...state,
        gpsTrackerOn: true,
        gpsStatus: 'Searching'
      }
    default:
      return state;
    }
}
