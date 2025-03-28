import { PROJECTS_LIST } from '../constants'
import toast from 'react-hot-toast'
import axiosInstance from  '../../helper/axiosInstance';

export const getProjects = (userId) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get(import.meta.env.VITE_BACKEND_URL+'projects/'+userId);
            
            if(response.data.success){
                dispatch({type:PROJECTS_LIST,data:response.data.data});
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


