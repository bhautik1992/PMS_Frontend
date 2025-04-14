import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from "react-router-dom";

const CanAccess = ({ permission, type, children }) => {
    const { permissions } = useSelector((state) => state.LoginReducer);
    
    if(type == 'route'){
        return permissions.includes(permission) ? children : <Navigate to="/not-authorized" replace />;
    }else{
        return permissions.includes(permission) ? children : null;
    }
}

export default CanAccess;


