Number.prototype.pad = function(size) {
  var s = String(this);
  while (s.length < (size || 2)) {s = "0" + s;}
  return s;
}

export default class Util {
  static timeLabels = {
    absent: '0',
    continuing: '1',
    arriveFirst: '5',
    arriveSecond: '10',
    arriveThird: '15',
    departFirst: '-5',
    departSecond: '-10',
    departThird: '-15'
  };

  static certaintyLabels = {
    certain: 1,
    uncertain: 2,
    nestCertain: 3,
    nestUncertain: 4
  };

  static certaintyLabelsUser = {
    certain: '✓',
    uncertain: '•',
    nestCertain: 'N✓',
    nestUncertain: 'N•'
  };

  static certaintyLabelsDb2UserMap = {
    '1': '✓',
    '2': '•',
    '3': 'N✓',
    '4': 'N•'
  }

  static estrusLabels = {
    a: 0,
    b: 25,
    c: 50,
    d: 75,
    e: 100
  };

  static estrusLabelsUser = {
    a: '.00',
    b: '.25',
    c: '.50',
    d: '.75',
    e: '1.0'
  };

  static estrusLabelsDb2UserMap = {
    '0': '.00',
    '25': '.25',
    '50': '.50',
    '75': '.75',
    '100': '1.0'
  }

  static dbTime2UserTime = (dbTime) => {
    // We expect something like 01-12:00J, so find the first - and take
    // everything after that.
    const dashIndex = dbTime.indexOf('-');
    return dbTime.substring(dashIndex + 1);
  }

  static getTrackerTimes = (time) => {
    const columnIndex = time.indexOf(':');
    const startMinute = parseInt(time.substring(columnIndex + 1, columnIndex + 3));
    let minutes = [];
    for (let i = 0; i < 15; ++i) { minutes.push(startMinute + i); }
    const hourString = time.substring(0, columnIndex + 1);
    const lastCharacter = time.slice(-1);
    return minutes.map((m, i) => { return hourString + m.pad(2) + lastCharacter });
  }
}