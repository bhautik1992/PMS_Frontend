import { combineReducers } from "redux";
import layout from "./layout";
import navbar from "./navbar";
import LoginReducer from "../services/reducers/LoginReducer";
import ProfileReducer from "../services/reducers/ProfileReducer";
import ProjectsReducer from "../services/reducers/ProjectsReducer";
import TasksReducer from "../services/reducers/TasksReducer";
import RolesReducer from "../services/reducers/RolesReducer";
import PermissionsReducer from "../services/reducers/PermissionsReducer";
import UsersReducer from "../services/reducers/UsersReducer";
import PopupReducer from "../services/reducers/common/PopupReducer";
import LoadingReducer from "../services/reducers/LoadingReducer";
import SettingReducer from "../services/reducers/SettingReducer";
import DesignationReducer from "../services/reducers/DesignationReducer";
import BanksReducer from "../services/reducers/BanksReducer";
import ClientsReducer from "../services/reducers/ClientsReducer";
import { LOGOUT_REQUEST } from "../services/constants";
import HolidayReducer from "../services/reducers/HolidayReducer";
import CountryReducer from '../services/reducers/CountriesReducer';

const appReducer = combineReducers({
    navbar,
    layout,
    LoginReducer,
    ProfileReducer,
    ProjectsReducer,
    UsersReducer,
    TasksReducer,
    RolesReducer,
    PermissionsReducer,
    PopupReducer,
    LoadingReducer,
    SettingReducer,
    DesignationReducer,
    BanksReducer,
    ClientsReducer,
    HolidayReducer,
    CountryReducer,
});

const rootReducer = (state, action) => {
    if(action.type === LOGOUT_REQUEST){
        state = undefined;
    }

    return appReducer(state, action);
};

export default rootReducer;


