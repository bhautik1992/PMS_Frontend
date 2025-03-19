import { PERMISSIONS_LIST, PERMISSIONS_DELETE, PERMISSIONS_ALL, ROLE_PERMISSIONS } from '../constants';

const initialState  = {
    permissions:[],                     //All Permissions with pagination
    total: 0,
    allPermissions:[],                  //All Permission not with pagination, Use inside modal popup
    roleAssignedPermissions:[],         //All Permissions assigned to specific role
}

const PermissionsReducer = (state = initialState, action) => {
    switch(action.type){
        case PERMISSIONS_LIST:
            return {
                ...state,
                permissions: action.data.permissions,
                total: action.data.total,
            }
        case PERMISSIONS_DELETE:
            return {
                ...state,
                permissions: state.permissions.filter((permission) => permission._id !== action.id),
                total: state.total - 1,
            }
        case PERMISSIONS_ALL:
            return {
                ...state,
                allPermissions: action.data
            }
        case ROLE_PERMISSIONS:
            return {
                ...state,
                roleAssignedPermissions:action.data
            }
        default:
            return state
    }
}

export default PermissionsReducer;


