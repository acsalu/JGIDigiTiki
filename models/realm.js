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
    FA_FOL_date: 'date',
    FA_FOL_B_focal_AnimID: 'string',
    FA_B_arr_AnimID: 'string',
    FA_time_start: {type: 'string', optional: true},
    FA_time_end: {type: 'string', optional: true},
    FA_duration_of_obs: {type: 'int', optional: true},
    FA_type_of_certainty: 'int',
    FA_type_of_cycle: 'int',
    FA_closest_to_focal: 'bool',
    FA_within_five_meters: 'bool'
  }
};

export default new Realm({schema: [Follow, FollowArrival]});