import { LOGIN_REQUEST, LOGOUT_REQUEST, UPDATE_PROFILE } from '../constants';

const loggedInUser = {
    isAuthenticated: false,
    user:null,
    permissions:[],
}

const LoginReducer = (state = loggedInUser, action) => {
    switch(action.type){
        case LOGIN_REQUEST:
            return {
                ...state,
                isAuthenticated: true,
                user: action.data.data,
                permissions: action.data.permissions
            }
        case LOGOUT_REQUEST:
            // Apply change in rootReducer.js to clear react-redux states
            // localStorage.clear();
            sessionStorage.clear();

            // return {
            //     ...state,
            //     isAuthenticated: false,
            //     user: null
            // }
        case UPDATE_PROFILE:
            return {
                ...state, //Creates a copy of the existing state object (preserves other properties like isAuthenticated)
                user: { 
                    ...state.user, //Creates a copy of the existing user object
                    ...action.data //Updates only the modified properties in the copied user object
                }
            }
        default:
            return state
    }
}

export default LoginReducer;


