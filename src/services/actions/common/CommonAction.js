import { TASKS_DELETE, ROLES_DELETE, PERMISSIONS_DELETE, USER_DELETE, OPEN_POPUP } from '../../constants'
import axiosInstance from '../../../helper/axiosInstance';
import toast from 'react-hot-toast'
import { MODULES } from '../../../views/Table/constants';

export const destroy = (module, deletedBy, id, url) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.post(import.meta.env.VITE_BACKEND_URL+url,{id,deletedBy});
            if(response.data.success){
                toast.success(response.data.message);

                switch(module){
                    case MODULES.TASKS:
                        dispatch({type:TASKS_DELETE,id});
                        break;
                    case MODULES.ROLES:
                        dispatch({type:ROLES_DELETE,id});
                        break;
                    case MODULES.PERMISSIONS:
                        dispatch({type:PERMISSIONS_DELETE,id});
                        break;
                    case MODULES.EMPLOYEE:
                        dispatch({type:USER_DELETE,id});
                        break;
                }
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
}

export const edit = (url) => {
    return async (dispatch) => {
        try {
            var revisedUrl = url.replace(/^\/+/, "");
            const response = await axiosInstance.get(import.meta.env.VITE_BACKEND_URL+revisedUrl);
            if(response.data.success){
                const data = response.data.data
                dispatch({type:OPEN_POPUP,data});
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
}


