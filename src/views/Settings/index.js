import { Fragment, useState, useEffect } from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardHeader, Label, Button, FormText } from 'reactstrap'
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import axiosInstance from '../../helper/axiosInstance';
import toast from 'react-hot-toast'

import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'

const Index = () => {
    const [initialValues, setInitialValues] = useState({
        emp_code: ''
    });
    
    // Using an IIFE (Immediately Invoked Function Expression) Inside useEffect
    useEffect(() => {
        (async () => {
            try {
                const response = await axiosInstance.get(import.meta.env.VITE_BACKEND_URL+'settings');
                if(response.data.success){
                    setInitialValues(prevValue => ({
                        ...prevValue,
                        ...response.data.data
                    }))
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
        })();
    },[])

    const validationSchema = Yup.object({
        emp_code : Yup.string()
            .required()
            .max(6)
            .label('Employee Code')
    })

    const onSubmit = async (values) => {
        try {
            const response = await axiosInstance.post(import.meta.env.VITE_BACKEND_URL+'settings', values);
            if(response.data.success){
                toast.success(response.data.message);
                setInitialValues(prevValue => ({
                    ...prevValue,
                    ...response.data.data
                }))
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
            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Settings</CardTitle>
                        </CardHeader>

                        <CardBody className='pt-1'>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                enableReinitialize={true}
                                onSubmit={onSubmit}
                            >
                                {({ errors, touched  }) => (
                                    <Form>
                                        <Row>
                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='emp_code'>
                                                    Employee Code<span className="required">*</span>
                                                </Label>
                                                <small className='text-muted ms-1'>
                                                    eg. <i>HS</i>
                                                </small>
                                
                                                <Field
                                                    type="text"
                                                    name="emp_code"
                                                    id="emp_code"
                                                    className={`form-control ${errors.emp_code && touched.emp_code ? 'is-invalid' : ''}`}
                                                    maxLength={6}
                                                    autoComplete="off"
                                                    autoFocus
                                                />
                                                <FormText className='text-muted'>
                                                    <span className='text-warning'>NOTE: Changing the Employee Code will update all existing employee codes.</span>
                                                </FormText>
                                                <ErrorMessage name="emp_code" component="div" className="invalid-feedback"/>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col className='mt-1' sm='12'>
                                                <Button type='submit' className='me-1' color='primary'>
                                                    Save
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                )}
                            </Formik>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>



    )
}

export default Index;