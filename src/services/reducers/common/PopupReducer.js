import { OPEN_POPUP, CLOSE_POPUP, RESET_POPUP_REDUCER } from '../../constants';

const initialState  = {
    popup:false,
    editdata:{}
}

const PopupReducer = (state = initialState, action) => {
    switch(action.type){
        case OPEN_POPUP:
            return {
                ...state,
                popup: true,
                editdata:action.data
            }
        case CLOSE_POPUP:
        case RESET_POPUP_REDUCER:
            return {
                ...state,
                popup: false,
                editdata:{}
            }
        default:
            return state
    }
}

export default PopupReducer;


