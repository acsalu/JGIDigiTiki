export default class Follow {}
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