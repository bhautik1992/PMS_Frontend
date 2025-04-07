import { PlusSquare } from 'react-feather'
import { useEffect, useState, useMemo } from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";

import DataTableComponent from '../Table/DataTableComponent';
import { usersTableColumn } from '../Table/Columns';
import { useSelector, useDispatch } from "react-redux";

import { Table, Card, CardHeader, CardTitle, Row, Col, Label, Button, Modal, ModalHeader, ModalBody, Input } from 'reactstrap'

import { CLOSE_POPUP, RESET_POPUP_REDUCER } from '../../services/constants';
import axiosInstance from  '../../helper/axiosInstance';
import toast from 'react-hot-toast'
import { Link  } from 'react-router-dom';

import CanAccess from '../../helper/CanAccess';
import { PERMISSION_ACTION } from '../../helper/constants';

import { getUsers } from '../../services/actions/UsersAction';
import { Helmet } from 'react-helmet-async';

const index = () => {
    const dispatch = useDispatch();

    const { users, total } = useSelector((state) => state.UsersReducer);
    const { popup, editdata } = useSelector((state) => state.PopupReducer);

    const [perModal, setPerModal] = useState(false);
    const [selectedPermissions, setSelectedPermissions] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState("");

    const validationSchema = Yup.object({
        selectedPermissions: Yup.array()
            .min(1, "At least one permission must be selected"),
    })

    const handleModalClosed = () => {
        setPerModal(false)
        dispatch({type:CLOSE_POPUP});
    }

    useEffect(() => {
        dispatch({type:RESET_POPUP_REDUCER});
        dispatch(getUsers());
    },[]);
    
    useEffect(() => {
        if(popup){
            setPerModal(true)
            setSelectedPermissions([]);

            if (editdata?.role_permissions?.length > 0 || editdata?.user_permissions?.length > 0) {
                const rolePermissions = editdata.role_permissions.map(temp => temp.permission_id);
                const userPermissions = editdata.user_permissions?.map(temp => temp.permission_id) || [];

                const uniquePermissions = [...new Set([
                    ...rolePermissions, 
                    ...userPermissions
                ])];

                setSelectedPermissions(uniquePermissions);
            }
        }
    }, [popup,editdata]);

    const handleCheckboxChange = (id) => {
        setSelectedPermissions(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const onSubmit = async (values) => {
        try {
            const request = { userId: editdata.user_id, selectedPermissions}
            const response = await axiosInstance.post('user/permissions/assign', request);

            if(response.data.success){
                toast.success(response.data.message);
                setPerModal(false)
                dispatch({type:CLOSE_POPUP});
            }
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

    const tableColumn = useMemo(() => usersTableColumn(currentPage,rowsPerPage),[currentPage,rowsPerPage])

    return (
        <>
            <Helmet>
                <title>Collaborator | PMS</title>
            </Helmet>

            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Collaborator List</CardTitle>

                            <CanAccess permission={PERMISSION_ACTION.EMPLOYEE_CREATE}>
                                <div className='d-flex mt-md-0 mt-1'>
                                    <Link to='/employee/create' className='ms-2' color='primary' size='lg'>
                                        <PlusSquare size={25} />
                                    </Link>
                                </div>
                            </CanAccess>
                        </CardHeader>

                        <DataTableComponent
                            columns={tableColumn}
                            data={users}
                            total={total}
                            currentPage={currentPage}
                            rowsPerPage={rowsPerPage}
                            searchValue={searchValue}
                            setCurrentPage={setCurrentPage}
                            setRowsPerPage={setRowsPerPage}
                            setSearchValue={setSearchValue}
                        />
                    </Card>
                </Col>
            </Row>

            <Modal 
                isOpen={perModal} 
                toggle={() => setPerModal(!perModal)} 
                className='modal-dialog-centered modal-lg'
                onClosed={handleModalClosed} 
            >
                <ModalHeader className='bg-transparent' toggle={() => setPerModal(!perModal)}></ModalHeader>
                
                <ModalBody className="px-sm-5 pb-5 modal-body">
                    <div className='text-center mb-2'>
                        <h2><u>Manage Permissions</u></h2>
                    </div>

                    <Formik
                        initialValues={{selectedPermissions}}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={onSubmit}
                    >
                        <Form>
                            <Row>
                                <Col xs={12}>
                                    <ErrorMessage name="selectedPermissions" component="div" className="invalid-feedback d-block"/>
                                    <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                        <Table className='table-flush-spacing' responsive>
                                            <tbody>
                                                {editdata && editdata?.permissions?.length > 0 && 
                                                editdata.permissions.map((permission, index) => (
                                                    <tr key={index}>
                                                        <td className='text-nowrap fw-bolder'>
                                                            {permission.name}
                                                        </td>

                                                        <td>
                                                            <div className='d-flex'>
                                                                <div className='form-check me-3 me-lg-5'>
                                                                    <Input
                                                                        type="checkbox"
                                                                        checked={selectedPermissions.includes(permission._id)}
                                                                        onChange={() => handleCheckboxChange(permission._id)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                    </div>
                                </Col>

                                <Col className='text-center mt-2' xs={12}>
                                    <Button type='submit' color='primary' className='me-1'>
                                        Submit
                                    </Button>

                                    <Button outline type='reset' onClick={() => setPerModal(false)}>
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Formik>
                </ModalBody>
            </Modal>
        </>
    )
};

export default index;


