import { Card, CardHeader, CardBody, CardTitle } from "reactstrap";
import { Row, Col } from 'reactstrap'
import { PlusSquare } from 'react-feather'
import '@styles/react/apps/app-users.scss'

import { Label, Button, Modal, ModalHeader, ModalBody } from 'reactstrap'
import { useState, useEffect, useRef, useMemo } from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

import toast from 'react-hot-toast'
import axiosInstance from '../../helper/axiosInstance';

import { useSelector, useDispatch } from "react-redux";
import { getPermissions } from '../../services/actions/PermissionsAction';

import DataTableComponent from '../Table/DataTableComponent';
import { permissionsTableColumn } from '../Table/Columns';
    
import { CLOSE_POPUP, RESET_POPUP_REDUCER } from '../../services/constants';

import { spaceToUnderscore } from '../../helper/common';

import CanAccess from "../../helper/CanAccess";
import { PERMISSION_ACTION } from "../../helper/constants";

const Index = () => {
    const perNameRef             = useRef(null);
    const dispatch               = new useDispatch();
    const [show, setShow]        = useState(false);
    const { permissions, total } = useSelector((state) => state.PermissionsReducer);
    const { popup, editdata }    = useSelector((state) => state.PopupReducer);

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState("");

    const validationSchema = Yup.object({
        name: Yup.string()
            .required()
            .max(50)
            .label('Name')
    })
    
    const [initialValues, setInitialValues] = useState({
        name: '',
        action:'',
        permissionId:'',
    });

    useEffect(() => {
        dispatch(getPermissions(currentPage, rowsPerPage, searchValue));
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
                action:editdata.action,
                permissionId:editdata._id
            }))
        }
    },[popup])
    
    const handleModalClosed = () => {
        dispatch({type:CLOSE_POPUP});
        
        setInitialValues({
            name:'',
            action:'',
            permissionId:''
        })
    }

    useEffect(() => {
        if (show) {
            setTimeout(() => {
                perNameRef.current?.focus();
            }, 100);
        }
    }, [show]);
    // End - Manage Popup

    const onSubmit = async (values) => {
        try {
            const response = await axiosInstance.post(import.meta.env.VITE_BACKEND_URL+'permissions/create', values);

            if(response.data.success){
                toast.success(response.data.message);
                setShow(false);
                dispatch(getPermissions(currentPage, rowsPerPage, searchValue));
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

    const tableColumn = useMemo(() => permissionsTableColumn(currentPage, rowsPerPage),[currentPage, rowsPerPage])

    return (
        <>
            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Permission List</CardTitle>

                            <CanAccess permission={PERMISSION_ACTION.PERMISSION_CREATE}>
                                <CardTitle tag='h4'>
                                    <Button color='primary' size='sm' onClick={() => {
                                        setInitialValues(prevVal => ({
                                            ...prevVal,
                                            name: '',
                                            permissionId:''
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
                            data={permissions}
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

                <Modal onClosed={handleModalClosed} isOpen={show} toggle={() => setShow(!show)} className='modal-dialog-centered' autoFocus={false}>
                    <ModalHeader className='bg-transparent' toggle={() => setShow(!show)}>
                        <span>{initialValues.permissionId ? 'Edit Permission' : 'Add New Permission'}</span>
                    </ModalHeader>
                    
                    <ModalBody className="px-sm-5 pb-5 modal-body">

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            enableReinitialize={true}
                            onSubmit={onSubmit}
                        >
                            {({ setFieldValue }) => (
                                <Form>
                                    <Row>
                                        <Col xs={12}>
                                            <Label className='form-label' for='name'>
                                                Name<span className="required">*</span>
                                            </Label>

                                            <Field
                                                innerRef={perNameRef}
                                                type="text"
                                                name="name"
                                                id="name"
                                                className='form-control'
                                                maxLength={50}
                                                onChange={(e) => {
                                                    setFieldValue("name", e.target.value);
                                                    setFieldValue("action", spaceToUnderscore(e.target.value));
                                                }}
                                                autoComplete="off"
                                            />

                                            <ErrorMessage name="name" component="div" className="invalid-feedback d-block"/>
                                        </Col>

                                        <Col xs={12} className="mt-1">
                                            <Label className='form-label' for='action'>
                                                Action
                                            </Label>

                                            <Field
                                                type="text"
                                                name="action"
                                                id="action"
                                                className='form-control'
                                                disabled
                                            />
                                        </Col>
                                        
                                        <Col xs={12} className='text-center mt-2'>
                                            <Button type='submit' className='me-1' color='primary'>
                                                {initialValues.permissionId ? 'Update Permission' : 'Create Permission'}
                                            </Button>

                                            <Button outline type='reset' onClick={() => setShow(false)}>
                                                Cancel
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            )}
                        </Formik>
                    </ModalBody>
                </Modal>
            </Row>
        </>
    )
}

export default Index;


