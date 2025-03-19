import { Link, useNavigate } from "react-router-dom";
import Avatar from "@components/avatar";
import { User, Settings, Power } from "react-feather";
import { UncontrolledDropdown, DropdownMenu, DropdownToggle, DropdownItem } from "reactstrap";
import defaultAvatar from '../../../../assets/images/profile/default.jpg';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from  '../../../../services/actions/LoginAction';
import toast from 'react-hot-toast'
import { useState, useEffect } from 'react';
import CanAccess from '../../../../helper/CanAccess';
import { PERMISSION_ACTION } from '../../../../helper/constants';

const UserDropdown = () => {
    const [profileImg,setProfileImg] = useState(defaultAvatar);
    const { user } = useSelector((state) => state.LoginReducer)
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        toast.success('Logged Out Successfully.');
        navigate("/login");
    }

    useEffect(() => {
        if(user?.profile_photo){
            setProfileImg(import.meta.env.VITE_BACKEND_ASSETS_URL+user.profile_photo)
        }
    },[user])

    return (
        <UncontrolledDropdown tag="li" className="dropdown-user nav-item">
            <DropdownToggle
                href="/"
                tag="a"
                className="nav-link dropdown-user-link"
                onClick={(e) => e.preventDefault()}
            >
                <div className="user-nav d-sm-flex d-none">
                    <span className="user-name fw-bold">Welcome {user && user.username}</span>
                    <span className="user-status fw-bold">{user && user.employee_code}</span>
                </div>
                <Avatar
                    img={profileImg}
                    imgHeight="40"
                    imgWidth="40"
                    status="online"
                />
            </DropdownToggle>
      
            <DropdownMenu end>
                <CanAccess permission={PERMISSION_ACTION.PROFILE}>
                    <DropdownItem tag={Link} to="/profile">
                        <User size={14} className="me-75" />
                        <span className="align-middle">Profile</span>
                    </DropdownItem>
                </CanAccess>

                <CanAccess permission={PERMISSION_ACTION.SETTINGS}>
                    <DropdownItem tag={Link} to="/settings">
                        <Settings size={14} className="me-75" />
                        <span className="align-middle">Settings</span>
                    </DropdownItem>
                </CanAccess>

                <DropdownItem tag={Link} to='#' onClick={handleLogout}>
                    <Power size={14} className="me-75" />
                    <span className="align-middle">Logout</span>
                </DropdownItem>
            </DropdownMenu>
        </UncontrolledDropdown>
    );
};

export default UserDropdown;
