import { USERS_LIST } from '../constants';

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
                activeUsers: (action.data).filter((user) => user.is_active === true),
            }
        default:
            return state
    }
}

export default UsersReducer;


