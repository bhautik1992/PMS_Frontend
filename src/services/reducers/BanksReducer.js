import { BANKS_ALL } from '../constants';

const initialState  = {
    allbanks:[]
}

const BanksReducer = (state = initialState, action) => {
    switch(action.type){
        case BANKS_ALL:
            return {
                ...state,
                allbanks: action.data
            }
        default:
            return state
    }
}

export default BanksReducer;


