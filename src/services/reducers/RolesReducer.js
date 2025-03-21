import { ROLES_LIST, ROLES_DELETE, ROLES_ALL } from '../constants';

const initialState  = {
    allroles: [],
    roles   : [],
    total   : 0,
}

const RolesReducer = (state = initialState, action) => {
    switch(action.type){
        case ROLES_ALL:
            return {
                ...state,
                allroles: action.data,
            }
        case ROLES_LIST:
            return {
                ...state,
                roles: action.data.roles,
                total: action.data.total,
            }
        case ROLES_DELETE:
            return {
                ...state,
                roles: state.roles.filter((role) => role._id !== action.id),
                total: state.total - 1
            }
        default:
            return state
    }
}

export default RolesReducer;


