import { Row,Col,Label,Input,Table,Modal,Button,ModalBody,ModalHeader } from 'reactstrap'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { getAllPermissions } from '../../services/actions/PermissionsAction';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from "yup";
import toast from 'react-hot-toast'
import axiosInstance from '../../helper/axiosInstance';

const RolePermissions = ({ showPerModal, setPerModal, roleInfo }) => {
    const dispatch = useDispatch();
    const { allPermissions, roleAssignedPermissions } = useSelector((state) => state.PermissionsReducer);
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    const validationSchema = Yup.object({
        selectedPermissions: Yup.array()
            .min(1, "At least one permission must be selected"),
    })
    
    useEffect(() => {
        if (showPerModal) {
            dispatch(getAllPermissions(roleInfo.roleId));
        }
    }, [showPerModal, dispatch, roleInfo.roleId]);

    useEffect(() => {
        if (showPerModal) {
            setSelectedPermissions(
                roleAssignedPermissions.length > 0 ? roleAssignedPermissions.map(temp => temp.permission_id) : []
            )
        }
    }, [roleAssignedPermissions, showPerModal]);

    const handleSelectAll = () => {
        if (selectedPermissions.length === allPermissions.length) {
            setSelectedPermissions([]); // Unselect all
        } else {
            setSelectedPermissions(allPermissions.map(permission => permission._id)); // Select all
        }
    };

    const handleCheckboxChange = (id) => {
        setSelectedPermissions(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    const onSubmit = async (values) => {
        try {
            const request = { roleId: roleInfo.roleId, selectedPermissions}
            const response = await axiosInstance.post('role_permissions/assign', request);

            if(response.data.success){
                toast.success(response.data.message);
                setPerModal(false)
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
    };

    return (
        <Modal
            isOpen={showPerModal}
            toggle={() => setPerModal(!showPerModal)}
            className='modal-dialog-centered modal-lg'
        >
            <ModalHeader className='bg-transparent' toggle={() => setPerModal(!showPerModal)}></ModalHeader>
            <ModalBody className='px-5 pb-5'>
                <div className='text-center mb-2'>
                    <h2><u>Set {roleInfo.name} Permissions</u></h2>
                </div>

                {allPermissions.length > 0 && (
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
                                                <tr>
                                                    <td className='text-nowrap fw-bolder'>
                                                        <span className='me-50'> Administrator Access</span>
                                                    </td>

                                                    <td>
                                                        <div className='form-check'>
                                                            <Input
                                                                type='checkbox'
                                                                id='select-all'
                                                                checked={selectedPermissions.length === allPermissions.length}
                                                                onChange={handleSelectAll}
                                                            />
                                                            <Label className='form-check-label' htmlFor='select-all'>
                                                                Select All
                                                            </Label>
                                                        </div>
                                                    </td>
                                                </tr>

                                                {allPermissions.map((permission, index) => (
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
                )}

                {allPermissions.length === 0 && (
                    <Row>
                        <Col xs={12}>
                            <h4 className='mt-2 pt-50 text-center'>There are no permissions created. Please create them.</h4>
                        </Col>
                    </Row>
                )}
            </ModalBody>
        </Modal>
    );
};

export default RolePermissions;


