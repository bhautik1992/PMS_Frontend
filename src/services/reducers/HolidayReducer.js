import {
  ADD_HOLIDAY,
  HOLIDAY_LIST,
  UPDATE_HOLIDAY,
  DELETE_HOLIDAY,
} from "../constants";

const initialState = {
  holidays: [],
};

const HolidayReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_HOLIDAY:
      return {
        ...state,
        holidays: [...state.holidays, action.payload],
      };

    case HOLIDAY_LIST:
      return {
        ...state,
        holidays: action.data,
      };

    case UPDATE_HOLIDAY:
      return {
        ...state,
        holidays: {
          ...state.holidays,
          Holidays: state.holidays.Holidays.map((holiday) =>
            holiday._id === action.payload._id ? action.payload : holiday
          ),
        },
      };

    case DELETE_HOLIDAY:
      return {
        ...state,
        holidays: {
          ...state.holidays,
          Holidays: state.holidays.Holidays.filter(
            (holiday) => holiday._id !== action.payload
          ),
        },
      };

    default:
      return state;
  }
};

export default HolidayReducer;
