import { USERS_LIST } from '../constants'
import axios from 'axios';
import toast from 'react-hot-toast'

export const getUsers = (token) => {
    return async (dispatch) => {
        try {
            await axios.get(import.meta.env.VITE_BACKEND_URL+'user',{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer '+token,
                },
            }).then(function (response) {
                if(response.data.success === true){
                    dispatch({type:USERS_LIST,data:response.data.data});
                }
            }).catch(function (error) {
                // console.log(error);
                toast.error(error.response.data.message);
            });
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


