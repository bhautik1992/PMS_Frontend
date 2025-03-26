import { USERS_LIST, USER_DELETE } from '../constants';

const initialState  = {
    users:[],
    activeUsers: [],
    total:0
}

const UsersReducer = (state = initialState, action) => {
    switch(action.type){
        case USERS_LIST:
            const actUsers = action.data.filter((user) => user.is_active === true);

            return {
                ...state,
                users: action.data,
                activeUsers: actUsers,
                total: actUsers.length,
            }
        case USER_DELETE:
                return {
                    ...state,
                    activeUsers: state.activeUsers.filter((user) => user._id !== action.id),
                    total: state.total - 1,
                }
        default:
            return state
    }
}

export default UsersReducer;


