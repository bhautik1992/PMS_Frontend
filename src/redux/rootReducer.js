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
import { LOGOUT_REQUEST } from "../services/constants";

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
});

const rootReducer = (state, action) => {
    if(action.type === LOGOUT_REQUEST){
        state = undefined;
    }

    return appReducer(state, action);
};

export default rootReducer;


