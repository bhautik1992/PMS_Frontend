import { TASKS_LIST } from '../constants'
import axiosInstance from '../../helper/axiosInstance';
import toast from 'react-hot-toast'

export const getTasks = (userId, page = 1, perPage = 10, search = "") => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get(import.meta.env.VITE_BACKEND_URL+'tasks',{
                params: { 
                    userId,
                    page, 
                    perPage,
                    search 
                }
            });
            
            if(response.data.success){
                dispatch({type:TASKS_LIST,data:response.data.data});
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


