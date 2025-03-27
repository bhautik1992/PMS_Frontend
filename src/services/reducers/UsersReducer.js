import { USERS_LIST, USER_DELETE } from '../constants';

const initialState  = {
    users:[],
    activeUsers: [],
    total:0
}

const UsersReducer = (state = initialState, action) => {
    switch(action.type){
        case USERS_LIST:
            return {
                ...state,
                users: action.data,
                total: action.data.length,
                activeUsers: action.data.filter((user) => user.is_active === true),
            }
        case USER_DELETE:
                return {
                    ...state,
                    users: state.users.filter((user) => user._id !== action.id),
                    total: state.total - 1,
                }
        default:
            return state
    }
}

export default UsersReducer;


