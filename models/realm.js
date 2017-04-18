import Realm from 'realm';

class Follow {}
Follow.className = 'Follow';
Follow.schema = {
  name: Follow.className,
  properties: {
    FOL_date: 'date',
    FOL_B_AnimID: 'string',
    FOL_CL_community_id: 'string',
    FOL_time_begin: 'string',
    FOL_time_end: {type: 'string', optional: true},
    FOL_flag_begin_in_nest: {type: 'bool', optional: true},
    FOL_flag_end_in_nest: {type: 'bool', optional: true},
    FOL_duration: {type: 'int', optional: true},
    FOL_distance_traveled: {type: 'int', optional: true},
    FOL_am_observer1: 'string',
    FOL_am_observer2: {type: 'string', optional: true},
    FOL_pm_observer1: {type: 'string', optional: true},
    FOL_pm_observer2: {type: 'string', optional: true},
    FOL_study_code1: {type: 'string', optional: true},
    FOL_study_code2: {type: 'string', optional: true},
    FOL_day: 'int',
    FOL_month: 'int',
    FOL_year: 'int'
  }
};

class FollowArrival {}
FollowArrival.className = 'FollowArrival';
FollowArrival.schema = {
  name: FollowArrival.className,
  properties: {
    date: 'date',
    followStartTime: 'string',
    focalId: 'string',
    chimpId: 'string',
    time: {type: 'string', optional: true},
    duration: {type: 'int', optional: true},
    certainty: 'int',
    estrus: 'int',
    isNearestNeighbor: 'bool',
    isWithin5m: 'bool',
    grooming: 'string'
  }
};

class Species {}
Species.className = 'Species';
Species.schema = {
  name: Species.className,
  properties: {
    date: 'date', // date
    startTime: 'string', // startTime
    endTime: 'string', // endTime
    focalId: 'string', // focalId
    speciesName: 'string', // speciesName
    speciesCount: 'int', // speciesCount
  }
};

class Food {}
Food.className = 'Food';
Food.schema = {
  name: Food.className,
  properties: {
    date: 'date',
    startTime: 'string',
    endTime: 'string',
    focalId: 'string',
    foodName: 'string',
    foodPart: 'string',
  }
};

class Location {}
Location.className = 'Location';
Location.schema = {
  name: Location.className,
  properties: {
    timestamp: 'int',
    longitude: 'float',
    latitude: 'float',
    altitude: 'float',
    accuracy: 'float'
  }
}

export default new Realm({
  schema: [Follow, FollowArrival, Species, Food, Location]
});