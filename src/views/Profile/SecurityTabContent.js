import { Fragment, useState } from 'react'
import { Row, Col, Card, Button, CardBody, CardTitle, CardHeader, FormFeedback, Label } from 'reactstrap'
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import InputPasswordToggle from "@components/input-password-toggle";
import { useSelector } from 'react-redux';
import axiosInstance from  '../../helper/axiosInstance';
import toast from 'react-hot-toast'

const SecurityTabContent = () => {
    const { user } = useSelector((state) => state.LoginReducer);
    const [account,setAccount] = useState(user);

    const validationSchema = Yup.object({
        current_password : Yup.string()
            .required()
            .min(8)
            .max(12)
            .label('Current Password'),
        new_password : Yup.string()
            .required()
            .min(8)
            .max(12)
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,12}$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            )
            .label('New Password'),
        retype_new_password: Yup.string()
            .required()
            .oneOf([Yup.ref("new_password")], "Passwords must match")
            .label("Retype New Password"),
    })

    const initialValues = {
        current_password   : '',
        new_password       : '',
        retype_new_password: ''
    }

    const onSubmit = async (values, { resetForm }) => {
        try {
            const response = await axiosInstance.post('user/change_password/'+account._id, values);
            if(response.data.success){
                toast.success(response.data.message);
                resetForm();
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

    return (
        <Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Change Password</CardTitle>
                </CardHeader>

                <CardBody className='pt-1'>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={onSubmit}
                    >
                        {({ errors, touched }) => (
                            <Form>
                                <Row>
                                    <Col sm='6' className='mb-1'>
                                        <Label className='form-label' for='current_password'>
                                            Current Password<span className="required">*</span>
                                        </Label>
                        
                                        <Field
                                            name="current_password"
                                            id="current_password"
                                            component={InputPasswordToggle}
                                            className={`form-control ${errors.current_password && touched.current_password ? 'is-invalid' : ''}`}
                                            maxLength={12}
                                            // autoFocus
                                        />

                                        <ErrorMessage name="current_password" component="div" className="invalid-feedback"/>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col sm='6' className='mb-1'>
                                        <Label className='form-label' for='new_password'>
                                            New Password<span className="required">*</span>
                                        </Label>
                        
                                        <Field
                                            name="new_password"
                                            id="new_password"
                                            component={InputPasswordToggle}
                                            className={`form-control ${errors.new_password && touched.new_password ? 'is-invalid' : ''}`}
                                            maxLength={12}
                                        />

                                        <ErrorMessage name="new_password" component="div" className="invalid-feedback"/>
                                    </Col>

                                    <Col sm='6' className='mb-1'>
                                        <Label className='form-label' for='retype_new_password'>
                                            Retype New Password<span className="required">*</span>
                                        </Label>
                        
                                        <Field
                                            name="retype_new_password"
                                            id="retype_new_password"
                                            component={InputPasswordToggle}
                                            className={`form-control ${errors.retype_new_password && touched.retype_new_password ? 'is-invalid' : ''}`}
                                        />

                                        <ErrorMessage name="retype_new_password" component="div" className="invalid-feedback"/>
                                    </Col>

                                    <Col xs={12}>
                                        <p className='fw-bolder'>Password requirements:</p>
                                        <ul className='ps-1 ms-25'>
                                            <li className='mb-50'>Minimum 8 to 12 characters long</li>
                                            <li className='mb-50'>At least one lowercase character, one uppercase character</li>
                                            <li className='mb-50'>At least one number, one special character </li>
                                        </ul>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col className='mt-1' sm='12'>
                                        <Button type='submit' className='me-1' color='primary'>
                                            Update
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default SecurityTabContent;
