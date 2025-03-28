import { CLIENTS_ALL } from '../constants';

const initialState  = {
    clients:[],
    activeClients:[]
}

const ClientsReducer = (state = initialState, action) => {
    switch(action.type){
        case CLIENTS_ALL:
            return {
                ...state,
                clients: action.data,
                activeClients: (action.data).filter((client) => client.is_active === true),
            }
        default:
            return state
    }
}

export default ClientsReducer;


