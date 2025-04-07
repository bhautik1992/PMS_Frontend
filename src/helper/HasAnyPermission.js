import { useSelector } from 'react-redux';

const HasAnyPermission = (permissionsToCheck = []) => {
    const { permissions } = useSelector((state) => state.LoginReducer);

    return permissionsToCheck.some(p => permissions.includes(p));
}

export default HasAnyPermission;


