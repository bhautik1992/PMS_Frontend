import {
  ADD_COUNTRY,
  UPDATE_COUNTRY,
  DELETE_COUNTRY,
  COUNTRY_LIST,
} from "../constants";

import axiosInstance from "../../helper/axiosInstance";
import toast from "react-hot-toast";

// Get Countries List
export const getCountries = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get("country");
      if (response.data.success) {
        dispatch({
          type: COUNTRY_LIST,
          payload: response.data.data,
        });
      }
    } catch (error) {
      let errorMessage = import.meta.env.VITE_ERROR_MSG;

      if (error.response) {
        errorMessage =
          error.response.data?.message || JSON.stringify(error.response.data);
      } else if (error.request) {
        errorMessage = import.meta.env.VITE_NO_RESPONSE;
        toast.error(errorMessage);
      }
    }
  };
};

// Create Country
export const createCountry = (values) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("country/create", values);
      console.log(response.data);
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch({
          type: ADD_COUNTRY,
          payload: response.data.data,
        });
      }
    } catch (error) {
      console.log(error);
      let errorMessage = import.meta.env.VITE_ERROR_MSG;

      if (error.response) {
        errorMessage =
          error.response.data?.message || JSON.stringify(error.response.data);
      } else if (error.request) {
        errorMessage = import.meta.env.VITE_NO_RESPONSE;
        toast.error(errorMessage);
      }
    }
  };
};

// Update Country
export const updateCountry = (id, values) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.put(`country/update/${id}`, values);
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch({
          type: UPDATE_COUNTRY,
          payload: response.data.data,
        });
      }
    } catch (error) {
      let errorMessage = import.meta.env.VITE_ERROR_MSG;

      if (error.response) {
        errorMessage =
          error.response.data?.message || JSON.stringify(error.response.data);
      } else if (error.request) {
        errorMessage = import.meta.env.VITE_NO_RESPONSE;
        toast.error(errorMessage);
      }
    }
  };
};

// Delete Country
export const deleteCountry = (id) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.delete(`country/delete/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch({
          type: DELETE_COUNTRY,
          payload: id,
        });
      } else {
        toast.error(response.data.message || "Failed to delete country.");
      }
    } catch (error) {
      let errorMessage = import.meta.env.VITE_ERROR_MSG;

      if (error.response) {
        errorMessage =
          error.response.data?.message || JSON.stringify(error.response.data);
      } else if (error.request) {
        errorMessage = "No response from server.";
        toast.error(errorMessage);
      }
    }
  };
};
