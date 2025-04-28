import axios from 'axios';
import { store } from '../redux/store';
import { START_LOADING, STOP_LOADING } from '../services/constants';


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.LoginReducer.user?._token;

        if(token){
            config.headers.Authorization = `Bearer ${token}`;
        }
        
        // store.dispatch({ type: START_LOADING });
        return config;
    },(error) => {
        // if(error.response && error.response.status === 401){

        // }

        // store.dispatch({ type: STOP_LOADING });
        console.log(error);
        return Promise.reject(error);
    }
);

// axiosInstance.interceptors.response.use(
//     (response) => {
//         store.dispatch({ type: STOP_LOADING });
//         return response;
//     },(error) => {
//         store.dispatch({ type: STOP_LOADING });
//         return Promise.reject(error);
//     }
// );

export default axiosInstance;

