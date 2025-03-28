import { PERMISSIONS_LIST, PERMISSIONS_ALL, ROLE_PERMISSIONS } from '../constants'
import axiosInstance from  '../../helper/axiosInstance';
import toast from 'react-hot-toast'

export const getPermissions = (page = 1, perPage = 10, search = "") => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get('permissions',{
                params: {
                    page, 
                    perPage,
                    search 
                }
            });
            
            if(response.data.success){
                dispatch({type:PERMISSIONS_LIST,data:response.data.data});
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

export const getAllPermissions = (roleId) => {
    return async (dispatch) => {
        try {
            const response = await axiosInstance.get('permissions/all',{
                params: { 
                    role_id:roleId,
                }
            });

            if(response.data.success){
                dispatch({type:PERMISSIONS_ALL,data:response.data.data.permissions});
                dispatch({type:ROLE_PERMISSIONS,data:response.data.data.role_permissions});
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



