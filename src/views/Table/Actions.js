import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { MoreVertical, Edit, Trash, Eye, Clock, Shield, Hexagon } from "react-feather";
import { edit, destroy } from '../../services/actions/common/CommonAction';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TimeEntry from '../Task/TimeEntry'
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import { MODULES } from './constants';

import CanAccess from '../../helper/CanAccess';
import HasAnyPermission from '../../helper/HasAnyPermission';
import { PERMISSION_ACTION } from '../../helper/constants';

const MySwal = withReactContent(Swal)

const Actions = ({ row, module, handleRolePermission }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.LoginReducer) || {};
    const deletedBy = user?._id || '';

    const [sidebarOpen, setSidebarOpen] = useState(false)
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen)

    const viewRecord = () => {
        const URL = `${module}/view/${row._id}`;
        console.log(URL);
    }
    
    const editRecord = () => {
        const isPopupModule = [MODULES.ROLE, MODULES.PERMISSION].includes(module);
        const urlPath = `/${module}${isPopupModule ? 's' : ''}/edit/${row._id}`;
        isPopupModule ? dispatch(edit(urlPath)) : navigate(urlPath);
    }
    
    const destroyRecord = async () => {
        const URL = (module === MODULES.EMPLOYEE) ? 'user/destroy' : `${module}s/destroy`;
        
        const result = await MySwal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            customClass: {
                confirmButton: 'btn btn-primary',
                cancelButton: 'btn btn-outline-danger ms-1'
            },
            buttonsStyling: false
        });

        if (result.isConfirmed) {
            dispatch(destroy(module, deletedBy, row._id, URL));
        }
    }
    
    const handleUserPermission = () => {
        const URL = `/user/permissions/${row._id}`;

        if(module == MODULES.EMPLOYEE){
            dispatch(edit(URL));
        }
    }

    return(
        <>
            {module === MODULES.EMPLOYEE && 
                <>
                    <CanAccess permission={PERMISSION_ACTION.EMPLOYEE_PERMISSIONS}>
                        <Hexagon size={18} className="pointer text-primary ms-1" onClick={() => handleUserPermission()}/>
                    </CanAccess>

                    <CanAccess permission={PERMISSION_ACTION.EMPLOYEE_EDIT}>
                        <Edit size={18} className="pointer text-primary ms-1" onClick={() => editRecord()} />
                    </CanAccess>

                    <CanAccess permission={PERMISSION_ACTION.EMPLOYEE_DELETE}>
                        <Trash size={18} className="pointer text-danger ms-1" onClick={() => destroyRecord()} />    
                    </CanAccess>
                </>
            }

            {module === MODULES.CLIENT && 
                <>
                    <CanAccess permission={PERMISSION_ACTION.CLIENT_EDIT}>
                        <Edit size={18} className="pointer text-primary ms-1" onClick={() => editRecord()} />
                    </CanAccess>

                    <CanAccess permission={PERMISSION_ACTION.CLIENT_DELETE}>
                        <Trash size={18} className="pointer text-danger ms-1" onClick={() => destroyRecord()} />    
                    </CanAccess>
                </>
            }

            {module === MODULES.ROLE &&
                <>
                    <CanAccess permission={PERMISSION_ACTION.ROLE_PERMISSIONS}>
                        <Shield size={18} className="pointer text-primary ms-1" onClick={() => handleRolePermission(row)} />
                    </CanAccess>

                    <CanAccess permission={PERMISSION_ACTION.ROLE_EDIT}>
                        <Edit size={18} className="pointer text-primary ms-1" onClick={() => editRecord()} />
                    </CanAccess>

                    <CanAccess permission={PERMISSION_ACTION.ROLE_DELETE}>
                        <Trash size={18} className="pointer text-danger ms-1" onClick={() => destroyRecord()} />
                    </CanAccess>
                    {/* <Eye size={18} className="pointer text-warning ms-1" onClick={() => viewRecord()} /> */}
                </>
            }

            {module === MODULES.PERMISSION &&
                <>
                    <CanAccess permission={PERMISSION_ACTION.PERMISSION_EDIT}>
                        <Edit size={18} className="pointer text-primary ms-1" onClick={() => editRecord()} />
                    </CanAccess>

                    <CanAccess permission={PERMISSION_ACTION.PERMISSION_DELETE}>
                        <Trash size={18} className="pointer text-danger ms-1" onClick={() => destroyRecord()} />    
                    </CanAccess>
                 </>
            }

            {module === MODULES.PROJECT &&
                <>
                    <CanAccess permission={PERMISSION_ACTION.PROJECT_EDIT}>
                        <Edit size={18} className="pointer text-primary ms-1" onClick={() => editRecord()} />
                    </CanAccess>

                    <CanAccess permission={PERMISSION_ACTION.PROJECT_DELETE}>
                        <Trash size={18} className="pointer text-danger ms-1" onClick={() => destroyRecord()} />    
                    </CanAccess>
                 </>
            }

            {module === MODULES.TASK &&
                <div className='d-flex'>
                    {
                        HasAnyPermission([
                            PERMISSION_ACTION.TASK_VIEW,
                            PERMISSION_ACTION.TASK_EDIT,
                            PERMISSION_ACTION.TASK_DELETE
                        ]) &&
                        <UncontrolledDropdown>
                            <DropdownToggle className='pe-1' tag='span'>
                                <MoreVertical size={15} />
                            </DropdownToggle>
                            
                            <DropdownMenu end container="body">
                                <CanAccess permission={PERMISSION_ACTION.TASK_VIEW}>
                                    <DropdownItem className='w-100' onClick={() => viewRecord()}>
                                        <Eye size={15} />
                                        <span className='align-middle ms-50'>View</span>
                                    </DropdownItem>
                                </CanAccess>

                                <CanAccess permission={PERMISSION_ACTION.TASK_EDIT}>
                                    <DropdownItem className='w-100' onClick={() => editRecord()}>
                                        <Edit size={15} />
                                        <span className='align-middle ms-50'>Edit</span>
                                    </DropdownItem>
                                </CanAccess>

                                <CanAccess permission={PERMISSION_ACTION.TASK_DELETE}>
                                    <DropdownItem className='w-100' onClick={() => destroyRecord()}>
                                        <Trash size={15} />
                                        <span className='align-middle ms-50'>Delete</span>
                                    </DropdownItem>
                                </CanAccess>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    }

                    <CanAccess permission={PERMISSION_ACTION.TASK_TIME_ENTRY}>
                        <Clock size={15} className="text-primary" onClick={toggleSidebar} />
                        <TimeEntry open={sidebarOpen} toggleSidebar={toggleSidebar} row={row} />
                    </CanAccess>
                </div>
            }
        </>
    )
}

export default Actions;
