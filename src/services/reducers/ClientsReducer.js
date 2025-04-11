import { CLIENTS_ALL, CLIENTS_LIST, CLIENT_DELETE } from '../constants';

const initialState  = {
    clients:[],
    activeClients:[],
    listing:[],
    total:0
}

const ClientsReducer = (state = initialState, action) => {
    switch(action.type){
        case CLIENTS_ALL:
            return {
                ...state,
                clients: action.data,
                activeClients: (action.data).filter((client) => client.is_active === true),
            }
        case CLIENTS_LIST:
            return{
                ...state,
                listing:action.data.clients,
                total: action.data.total,
            }
        case CLIENT_DELETE:
            return {
                ...state,
                listing: state.listing.filter((list) => list._id !== action.id),
                total: state.total - 1
            }
        default:
            return state
    }
}

export default ClientsReducer;


