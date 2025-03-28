import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";
import { Row, Col } from 'reactstrap'
import { PlusSquare } from 'react-feather'
import '@styles/react/apps/app-users.scss'

import { Label, Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { useState, useEffect, useRef, useMemo } from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

import toast from 'react-hot-toast'
import axiosInstance from  '../../helper/axiosInstance';

import { useSelector, useDispatch } from "react-redux";
import { getRoles } from '../../services/actions/RolesAction';

import DataTableComponent from '../Table/DataTableComponent';
import { rolesTableColumn } from '../Table/Columns';
    
import { CLOSE_POPUP, RESET_POPUP_REDUCER } from '../../services/constants';
import RolePermissions from './RolePermissions';

import CanAccess from "../../helper/CanAccess";
import { PERMISSION_ACTION } from "../../helper/constants";

const Index = () => {
    const roleNameRef         = useRef(null);
    const dispatch            = new useDispatch();
    const [show, setShow]     = useState(false);
    const { roles, total }    = useSelector((state) => state.RolesReducer);
    const { popup, editdata } = useSelector((state) => state.PopupReducer);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState("");

    const [showPerModal, setPerModal] = useState(false);
    const [roleInfo, setRoleInfo] = useState({
        roleId:'',
        name:'',
    })

    const validationSchema = Yup.object({
        name: Yup.string()
            .required()
            .max(50)
            .label('Name')
    })
    
    const [initialValues, setInitialValues] = useState({
        name: '',
        roleId:''
    });

    useEffect(() => {
        dispatch(getRoles(currentPage, rowsPerPage, searchValue));
    }, [dispatch, currentPage, rowsPerPage, searchValue]);

    // Start - Manage Popup
    useEffect(() => {
        dispatch({type:RESET_POPUP_REDUCER});
    },[]);

    useEffect(() => {
        if(popup){
            setShow(true)
            
            setInitialValues(prevVal => ({
                ...prevVal,
                name:editdata.name,
                roleId:editdata._id
            }))
        }
    },[popup])
    
    const handleModalClosed = () => {
        setShow(false)
        dispatch({type:CLOSE_POPUP});

        setInitialValues({
            name:'',
            roleId:''
        })
    }

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                roleNameRef.current?.focus();
            }, 100);
        }
    }, [show]);
    // End - Manage Popup

    const onSubmit = async (values) => {
        try {
            const response = await axiosInstance.post(import.meta.env.VITE_BACKEND_URL+'roles/create', values);

            if(response.data.success){
                toast.success(response.data.message);
                setShow(false);
                dispatch(getRoles(currentPage, rowsPerPage, searchValue));
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

    const handleRolePermission = (row) => {
        setPerModal(true)

        setRoleInfo({
            roleId:row._id,
            name:row.name
        })
    }

    const tableColumn = useMemo(() => rolesTableColumn(currentPage,rowsPerPage,handleRolePermission),[currentPage,rowsPerPage])

    return (
        <>
            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Roles List</CardTitle>

                            <CanAccess permission={PERMISSION_ACTION.ROLE_CREATE}>
                                <CardTitle tag='h4'>
                                    <Button color='primary' size='sm' onClick={() => {
                                        setInitialValues(prevVal => ({
                                            ...prevVal,
                                            name: '',
                                            roleId:''
                                        }))
                                        
                                        setShow(true)
                                    }} outline>
                                        <PlusSquare size={15} />
                                    </Button>
                                </CardTitle>
                            </CanAccess>
                        </CardHeader>

                        <DataTableComponent
                            columns={tableColumn}
                            data={roles}
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

                {showPerModal && roleInfo && (
                    <RolePermissions 
                        showPerModal={showPerModal} 
                        setPerModal={setPerModal} 
                        roleInfo={roleInfo} 
                    />
                )}

                <Modal onClosed={handleModalClosed} isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered' autoFocus={false}>
                    <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}>
                        <span>{initialValues.roleId ? 'Edit Role' : 'Add Role'}</span>
                    </ModalHeader>
                    
                    <ModalBody className="px-sm-5 pb-5 modal-body">

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            enableReinitialize={true}
                            onSubmit={onSubmit}
                        >
                            <Form>
                                <Row>
                                    <Col xs={12}>
                                        <Label className='form-label' for='role-name'>
                                            Role Name<span className="required">*</span>
                                        </Label>

                                        <Field
                                            innerRef={roleNameRef}
                                            type="text"
                                            name="name"
                                            id="name"
                                            className='form-control'
                                            maxLength={50}
                                            autoComplete="off"
                                        />

                                        <ErrorMessage name="name" component="div" className="invalid-feedback d-block"/>
                                    </Col>
                                    
                                    <Col xs={12} className='text-center mt-2'>
                                        <Button type='submit' className='me-1' color='primary'>
                                            {initialValues.roleId ? 'Update' : 'Save'}
                                        </Button>

                                        <Button outline type='reset' onClick={() => setShow(false)}>
                                            Cancel
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Formik>
                    </ModalBody>
                </Modal>
            </Row>
        </>
    )
}

export default Index;


