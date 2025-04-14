import { COUNTRIES_LIST, DELETE_COUNTRY } from "../constants";

const initialState = {
  countries: [],
  total: 0,
};

const CountriesReducer = (state = initialState, action) => {
  switch (action.type) {
    case COUNTRIES_LIST:
      return {
        ...state,
        countries: action.data.countries,
        total: action.data.total,
      };
    case DELETE_COUNTRY:
      return {
        ...state,
        countries: state.countries.filter(
          (country) => country._id !== action.id
        ),
        total: state.total - 1,
      };
    default:
      return state;
  }
};

export default CountriesReducer;
    