export default class FollowArrival {}
FollowArrival.schema = {
  name: 'FollowArrival',
  properties: {
    FA_FOL_date: 'date',
    FA_FOL_B_focal_AnimID: 'string',
    FA_B_arr_AnimID: 'string',
    FA_seq_num: 'int',
    FA_type_of_certainty: 'int',
    FA_type_of_nesting: 'int',
    FA_type_of_cycle: 'int',
    FA_time_start: 'string',
    FA_time_end: 'string',
    FA_duration_of_obs: 'int'
  }
};