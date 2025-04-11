import { CLIENTS_ALL, CLIENTS_LIST } from '../constants'
import toast from 'react-hot-toast'
import axiosInstance from  '../../helper/axiosInstance';

export const getClients = () => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get('clients');
            
            if(response.data.success){
                dispatch({type:CLIENTS_ALL,data:response.data.data});
            }
        } catch (error) {
            let errorMessage = import.meta.env.VITE_ERROR_MSG;

            if(error.response){
                errorMessage = error.response.data?.message || JSON.stringify(error.response.data); // Case 1: API responded with an error
            }else if (error.request){
                errorMessage = import.meta.env.VITE_NO_RESPONSE; // Case 2: Network error
            }
    
            // console.error(error.message);
            toast.error(errorMessage);
        }   
    }
};

export const clientListing = (userId, page = 1, perPage = 10, search = "", filter ={}) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get('clients/listing',{
                params: { 
                    userId,
                    page, 
                    perPage,
                    search,
                    filter 
                }
            });
            
            if(response.data.success){
                dispatch({type:CLIENTS_LIST,data:response.data.data});
            }
        } catch (error) {
            let errorMessage = import.meta.env.VITE_ERROR_MSG;

            if(error.response){
                errorMessage = error.response.data?.message || JSON.stringify(error.response.data); // Case 1: API responded with an error
            }else if (error.request){
                errorMessage = import.meta.env.VITE_NO_RESPONSE; // Case 2: Network error
            }
    
            // console.error(error.message);
            toast.error(errorMessage);
        }   
    }
};
