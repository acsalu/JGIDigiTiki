export const increment = () => {
  return {
    type: 'INCREMENT'
  };
};

export const decrement = () => {
  return {
    type: 'DECREMENT'
  }
};

export const reset = () => {
  return {
    type: 'RESET'
  }
};

export const trackGps = () => {
  return {
    type: 'TRACK_GPS'
  }
}
