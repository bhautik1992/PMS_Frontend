import { Fragment, useState, useEffect } from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardHeader, Label, Button, FormText } from 'reactstrap'
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import axiosInstance from  '../../helper/axiosInstance';
import toast from 'react-hot-toast';

import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'

import { Helmet } from 'react-helmet-async';

const Index = () => {
    const [initialValues, setInitialValues] = useState({
        orignal_code:'',
        emp_code    : '',
        linkedin_url: '',
        twitter_url : '',
    });

    
    // Using an IIFE (Immediately Invoked Function Expression) Inside useEffect
    useEffect(() => {
        (async () => {
            try {
                const response = await axiosInstance.get('settings');
                if(response.data.success){
                    setInitialValues(prevValue => ({
                        ...prevValue,
                        ...response.data.data,
                        orignal_code:response.data.data.emp_code,
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
            .label('Employee Code'),
        linkedin_url : Yup.string()
            .required()
            .matches(
                /^https:\/\/([\w]+\.)?linkedin\.com\/.+$/,
                "Invalid LinkedIn URL format"
            )
            .max(50)
            .label('Linkedin URL'),
        twitter_url : Yup.string()
            .required()
            .matches(
                /^https:\/\/([\w]+\.)?twitter\.com\/.+$/,
                "Invalid Twitter URL format"
            )
            .max(50)
            .label('Twitter URL')
    })

    const onSubmit = async (values) => {
        try {
            if(values.orignal_code !== values.emp_code){
                const confirmChange = window.confirm("Changing Employee Code will update all existing employee codes. Do you want to continue?");
                if (!confirmChange) return;
            }

            const response = await axiosInstance.post('settings', values);
            if(response.data.success){
                toast.success(response.data.message);
                setInitialValues(prevValue => ({
                    ...prevValue,
                    ...response.data.data,
                    orignal_code:response.data.data.emp_code,
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
            <Helmet>
                <title>Settings | PMS</title>
            </Helmet>

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

                                                <ErrorMessage name="emp_code" component="div" className="invalid-feedback"/>
                                            </Col>

                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='linkedin_url'>
                                                    Linkedin URL<span className="required">*</span>
                                                </Label>
                                
                                                <Field
                                                    type="text"
                                                    name="linkedin_url"
                                                    id="linkedin_url"
                                                    className={`form-control ${errors.linkedin_url && touched.linkedin_url ? 'is-invalid' : ''}`}
                                                    placeholder="https://www.linkedin.com/in/your-profile"
                                                    maxLength={50}
                                                    autoComplete="off"
                                                    />

                                                <ErrorMessage name="linkedin_url" component="div" className="invalid-feedback"/>
                                            </Col>

                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='twitter_url'>
                                                    Twitter URL<span className="required">*</span>
                                                </Label>
                                
                                                <Field
                                                    type="text"
                                                    name="twitter_url"
                                                    id="twitter_url"
                                                    className={`form-control ${errors.twitter_url && touched.twitter_url ? 'is-invalid' : ''}`}
                                                    placeholder="https://twitter.com/your-username"
                                                    maxLength={50}
                                                    autoComplete="off"
                                                />

                                                <ErrorMessage name="twitter_url" component="div" className="invalid-feedback"/>
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