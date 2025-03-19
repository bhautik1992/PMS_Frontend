import React from 'react';
import { useSelector } from 'react-redux';

const CanAccess = ({ permission, children }) => {
    const { permissions } = useSelector((state) => state.LoginReducer);

    return permissions.includes(permission) ? children : null;
}

export default CanAccess;