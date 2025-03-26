import { USERS_LIST } from '../constants'
import toast from 'react-hot-toast'
import axiosInstance from '../../helper/axiosInstance';

export const getUsers = (token) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get('user');
            if(response.data.success === true){
                dispatch({type:USERS_LIST,data:response.data.data});
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


