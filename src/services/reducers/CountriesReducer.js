import {
  ADD_COUNTRY,
  COUNTRY_LIST,
  UPDATE_COUNTRY,
  DELETE_COUNTRY,
} from "../constants";

const initialState = {
  countries: [],
};

const CountriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_COUNTRY:
      return {
        ...state,
        countries: [...state.countries, action.payload],
      };

    case COUNTRY_LIST:
      return {
        ...state,
        countries: action.payload,
      };

    case UPDATE_COUNTRY:
      return {
        ...state,
        countries: state.countries.map((country) =>
          country._id === action.payload._id ? action.payload : country
        ),
      };

    case DELETE_COUNTRY:
      return {
        ...state,
        countries: state.countries.filter(
          (country) => country._id !== action.payload
        ),
      };

    default:
      return state;
  }
};

export default CountriesReducer;
