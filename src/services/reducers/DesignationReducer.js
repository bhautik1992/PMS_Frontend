import { DESIGNATIONS_LIST } from '../constants';

const initialState  = {
    designations:{}
}

const DesignationReducer = (state = initialState, action) => {
    switch(action.type){
        case DESIGNATIONS_LIST:
            return {
                ...state,
                designations: action.data
            }
        default:
            return state
    }
}

export default DesignationReducer;


