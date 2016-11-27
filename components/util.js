export default class Util {
  static certaintyLabels = {
    certain: '1',
    uncertain: '2',
    nestCertain: '3',
    nestUncertain: '4'
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
    a: '0',
    b: '25',
    c: '50',
    d: '75',
    e: '100'
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
}