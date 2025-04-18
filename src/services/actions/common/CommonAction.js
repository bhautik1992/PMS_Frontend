import { TASKS_DELETE, ROLES_DELETE, PERMISSIONS_DELETE, USER_DELETE, OPEN_POPUP, PROJECT_DELETE, CLIENT_DELETE, HOLIDAY_DELETE } from '../../constants'
import axiosInstance from  '../../../helper/axiosInstance';
import toast from 'react-hot-toast'
import { MODULES } from '../../../views/Table/constants';

export const destroy = (module, deletedBy, id, url) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.post(url,{id,deletedBy});
            if(response.data.success){
                toast.success(response.data.message);

                switch(module){
                    case MODULES.TASK:
                        dispatch({type:TASKS_DELETE,id});
                        break;
                    case MODULES.ROLE:
                        dispatch({type:ROLES_DELETE,id});
                        break;
                    case MODULES.PERMISSION:
                        dispatch({type:PERMISSIONS_DELETE,id});
                        break;
                    case MODULES.EMPLOYEE:
                        dispatch({type:USER_DELETE,id});
                        break;
                    case MODULES.PROJECT:
                        dispatch({type:PROJECT_DELETE,id});
                        break;
                    case MODULES.CLIENT:
                        dispatch({type:CLIENT_DELETE,id});
                        break;
                    case MODULES.HOLIDAY:
                        dispatch({type:HOLIDAY_DELETE,id});
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
            
            const response = await axiosInstance.get(revisedUrl);
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


