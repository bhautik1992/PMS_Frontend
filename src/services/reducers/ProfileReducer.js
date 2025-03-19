import { UPDATE_PROFILE } from '../constants';

const initialState  = {
    user:null
}

const ProfileReducer = (state = initialState, action) => {
    switch(action.type){
        case UPDATE_PROFILE:
            return {
                ...state,
                user: action.data
            }
        default:
            return state
    }
}

export default ProfileReducer;


