import { SYSTEM_SETTING, UPDATE_SYSTEM_SETTING } from '../constants';

const initialState  = {
    settings:{}
}

const SettingReducer = (state = initialState, action) => {
    switch(action.type){
        case SYSTEM_SETTING:
            return {
                ...state,
                settings: action.data
            }
        case UPDATE_SYSTEM_SETTING:
            return {
                ...state,
                settings: {
                    ...state.settings,
                    ...action.data
                }
            }
        default:
            return state
    }
}

export default SettingReducer;


