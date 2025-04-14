import {
  ADD_HOLIDAY,
  HOLIDAY_LIST,
  DELETE_HOLIDAY,
  UPDATE_HOLIDAY,
} from "../constants";
import axiosInstance from "../../helper/axiosInstance";
import toast from "react-hot-toast";

export const createHoliday = (values) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.post("holiday/create", values);

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch({
          type: ADD_HOLIDAY,
          payload: response.data.data,
        });
      }
    } catch (error) {
      let errorMessage = "Something went wrong";

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

// Get Holidays
export const getHolidays = () => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.get("holiday");

      if (response.data.success) {
        dispatch({
          type: HOLIDAY_LIST,
          data: response.data.data, // adjust if your API returns differently
        });
      }
    } catch (error) {
      let errorMessage = import.meta.env.VITE_ERROR_MSG;

      if (error.response) {
        errorMessage =
          error.response.data?.message || JSON.stringify(error.response.data);
      } else if (error.request) {
        errorMessage = import.meta.env.VITE_NO_RESPONSE;
      }

      toast.error(errorMessage);
    }
  };
};

export const updateHoliday = (id, values) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.put(`holiday/update/${id}`, values);

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch({
          type: UPDATE_HOLIDAY,
          payload: response.data.data,
        });
      }
    } catch (error) {
      let errorMessage = "Something went wrong";

      if (error.response) {
        errorMessage =
          error.response.data?.message || JSON.stringify(error.response.data);
      } else if (error.request) {
        errorMessage = "No response from server.";
      }

      toast.error(errorMessage);
    }
  };
};

export const deleteHoliday = (id) => {
  return async (dispatch) => {
    try {
      const response = await axiosInstance.delete(`holiday/delete/${id}`);

      if (response.data.success) {
        toast.success(response.data.message);
        dispatch({
          type: DELETE_HOLIDAY,
          payload: id,
        });
      } else {
        toast.error(response.data.message || "Failed to delete holiday.");
      }
    } catch (error) {
      console.error(error.message);
      let errorMessage = "Something went wrong";

      if (error.response) {
        errorMessage =
          error.response.data?.message || JSON.stringify(error.response.data);
      } else if (error.request) {
        errorMessage = "No response from server.";
      }

      toast.error(errorMessage);
    }
  };
};
