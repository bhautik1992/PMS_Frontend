import { useSelector } from "react-redux";
import SpinnerComponent from "../@core/components/spinner/Fallback-spinner";

const GlobalSpinner = () => {
    const isLoading = useSelector((state) => state.LoadingReducer.loading);
    return isLoading ? <SpinnerComponent /> : null;
};

export default GlobalSpinner;


