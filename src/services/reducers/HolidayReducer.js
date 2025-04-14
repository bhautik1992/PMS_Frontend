import {HOLIDAYS_LIST, HOLIDAY_DELETE} from "../constants";

const initialState = {
    holidays: [],
    total   : 0
};

const HolidayReducer = (state = initialState, action) => {
    switch (action.type) {
        case HOLIDAYS_LIST:
            return {
                ...state,
                holidays: action.data.holidays,
                total: action.data.total,
            };
        case HOLIDAY_DELETE:
            return {
                ...state,
                holidays: state.holidays.filter((holiday) => holiday._id !== action.id),
                total: state.total - 1
            }
    default:
        return state;
  }
};

export default HolidayReducer;
