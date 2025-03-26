import { Fragment, useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Label, Row, Col, Input, Button } from 'reactstrap'
import '@styles/react/libs/react-select/_react-select.scss'

import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

const PersonalInfo = ({ stepper, additionalInfo, updateFormData }) => {
    const isEmpty = Object.keys(additionalInfo.editUserInfo).length === 0;

    const [initialValues, setInitialValues] = useState({
        first_name             : '',
        last_name              : '',
        middle_name            : '',
        personal_email         : '',
        mobile_number          : '',
        alternate_mobile_number: '',
        emergency_contact      : '',
        gender                 : '',
    })

    const validationSchema = Yup.object({
        first_name: Yup.string()
            .required()
            .max(30)
            .label('First Name'),
        last_name: Yup.string()
            .required()
            .max(30)
            .label('Last Name'),
        middle_name: Yup.string()
            .required()
            .max(30)
            .label('Middle Name'),
        personal_email: Yup.string()
            .required()
            .email()
            .max(50)
            .label('Email'),
        mobile_number : Yup.string()
            .required()
            .min(10)
            .max(10)
            .label('Mobile Number'),
        alternate_mobile_number : Yup.string()
            .required()
            .min(10)
            .max(10)
            .label('Alternate Mobile Number'),
        emergency_contact : Yup.string()
            .required()
            .min(10)
            .max(10)
            .label('Emergency Contact'),
        gender: Yup.string()
            .required()
            .label('Gender'),
    })

    const handleNumericInput = (event, setFieldValue) => {
        const { name, value } = event.target;
        const numericValue = value.replace(/[^0-9]/g, "");
        setFieldValue(name, numericValue);
    }

    useEffect(() => {
        if(isEmpty == false){
            setInitialValues(prevVal => ({
                ...prevVal,
                first_name             : additionalInfo.editUserInfo.first_name,
                last_name              : additionalInfo.editUserInfo.last_name,
                middle_name            : additionalInfo.editUserInfo.middle_name,
                personal_email         : additionalInfo.editUserInfo.personal_email,
                mobile_number          : additionalInfo.editUserInfo.mobile_number,
                alternate_mobile_number: additionalInfo.editUserInfo.alternate_mobile_number,
                emergency_contact      : additionalInfo.editUserInfo.emergency_contact,
                gender                 : additionalInfo.editUserInfo.gender,
            }))
        }
    },[additionalInfo.editUserInfo])

    const onSubmit = async (values) => {
        const isExit = (values.actionType === "saveExit")?true:false;
        await updateFormData(2, 'personalInfo', values, isExit);
        stepper.next()
    }

    return (
        <Fragment>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={onSubmit}
            >
                {({ errors, touched, setFieldValue }) => (
                    <Form>
                        <Row>
                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='first_name'>
                                    First Name<span className="required">*</span>
                                </Label>

                                <Field
                                    type="text"
                                    name="first_name"
                                    id="first_name"
                                    className={`form-control ${errors.first_name && touched.first_name ? 'is-invalid' : ''}`}
                                    maxLength={30}
                                    autoComplete="off"
                                    autoFocus
                                />

                                <ErrorMessage name="first_name" component="div" className="invalid-feedback"/>
                            </Col>

                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='last_name'>
                                    Last Name<span className="required">*</span>
                                </Label>
                
                                <Field
                                    type="text"
                                    name="last_name"
                                    id="last_name"
                                    className={`form-control ${errors.last_name && touched.last_name ? 'is-invalid' : ''}`}
                                    maxLength={30}
                                    autoComplete="off"
                                />

                                <ErrorMessage name="last_name" component="div" className="invalid-feedback"/>
                            </Col>
                        </Row>

                        <Row>
                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='middle_name'>
                                    Middle Name<span className="required">*</span>
                                </Label>
                
                                <Field
                                    type="text"
                                    name="middle_name"
                                    id="middle_name"
                                    className={`form-control ${errors.middle_name && touched.middle_name ? 'is-invalid' : ''}`}
                                    maxLength={30}
                                    autoComplete="off"
                                />

                                <ErrorMessage name="middle_name" component="div" className="invalid-feedback"/>
                            </Col>

                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='personal_email'>
                                    Email<span className="required">*</span>
                                </Label>
                
                                <Field
                                    type="text"
                                    name="personal_email"
                                    id="personal_email"
                                    className={`form-control ${errors.personal_email && touched.personal_email ? 'is-invalid' : ''}`}
                                    maxLength={50}
                                    autoComplete="off"
                                />

                                <ErrorMessage name="personal_email" component="div" className="invalid-feedback"/>
                            </Col>
                        </Row>

                        <Row>
                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='mobile_number'>
                                    Mobile Number<span className="required">*</span>
                                </Label>
                
                                <div className="input-group">
                                    <span className={`readonly input-group-text ${errors.mobile_number && touched.mobile_number ? 'is-invalid' : ''}`}>+91</span>

                                    <Field
                                        type="text"
                                        name="mobile_number"
                                        id="mobile_number"
                                        className={`form-control ${errors.mobile_number && touched.mobile_number ? 'is-invalid' : ''}`}
                                        maxLength={10}
                                        onChange={(event) => handleNumericInput(event, setFieldValue)}
                                        autoComplete={'off'}
                                    />

                                    <ErrorMessage name="mobile_number" component="div" className="invalid-feedback" />
                                </div>
                            </Col>

                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='alternate_mobile_number'>
                                    Alternate Mobile Number<span className="required">*</span>
                                </Label>
                
                                <div className="input-group">
                                    <span className={`readonly input-group-text ${errors.alternate_mobile_number && touched.alternate_mobile_number ? 'is-invalid' : ''}`}>+91</span>

                                    <Field
                                        type="text"
                                        name="alternate_mobile_number"
                                        id="alternate_mobile_number"
                                        className={`form-control ${errors.alternate_mobile_number && touched.alternate_mobile_number ? 'is-invalid' : ''}`}
                                        maxLength={10}
                                        onChange={(event) => handleNumericInput(event, setFieldValue)}
                                        autoComplete={'off'}
                                    />

                                    <ErrorMessage name="alternate_mobile_number" component="div" className="invalid-feedback" />
                                </div>
                            </Col>                
                        </Row>

                        <Row>
                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='emergency_contact'>
                                    Emergency Contact<span className="required">*</span>
                                </Label>
                
                                <div className="input-group">
                                    <span className={`readonly input-group-text ${errors.emergency_contact && touched.emergency_contact ? 'is-invalid' : ''}`}>+91</span>

                                    <Field
                                        type="text"
                                        name="emergency_contact"
                                        id="emergency_contact"
                                        className={`form-control ${errors.emergency_contact && touched.emergency_contact ? 'is-invalid' : ''}`}
                                        maxLength={10}
                                        onChange={(event) => handleNumericInput(event, setFieldValue)}
                                        autoComplete={'off'}
                                    />

                                    <ErrorMessage name="emergency_contact" component="div" className="invalid-feedback" />
                                </div>
                            </Col>

                            <Col md='6' className='mb-1'>
                                <Label className='form-label'>
                                    Gender<span className="required">*</span>
                                </Label>

                                <div className="d-flex align-items-center">
                                    <Field
                                        type="radio"
                                        name="gender"
                                        id="male"
                                        value="male"
                                        className="form-check-input"
                                        style={{ marginRight: '5px' }}
                                    />
                                    
                                    <label className="form-check-label" htmlFor="male">
                                        Male
                                    </label>
                                    
                                    <div className="ms-1">
                                        <Field
                                            type="radio"
                                            name="gender"
                                            id="female"
                                            value="female"
                                            className="form-check-input"
                                            style={{ marginRight: '5px' }}
                                        />

                                        <label className="form-check-label" htmlFor="female">
                                            Female
                                        </label>
                                    </div>
                                </div>
                                
                                <ErrorMessage name="gender" component="div" className="invalid-feedback d-block" />
                            </Col>
                        </Row>
            
                        <div className='d-flex justify-content-between'>
                            <Button color='secondary' className='btn-prev' outline disabled>
                                <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                                <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                            </Button>
            
                            <div className=''>
                                {isEmpty == false &&
                                    <Button 
                                        type='submit' 
                                        color='success' 
                                        className='mx-1'
                                        onClick={() => setFieldValue("actionType", "saveExit")}
                                    >
                                        <span className='align-middle d-sm-inline-block d-none'>Save & Exit</span>
                                    </Button>
                                }

                                <Button 
                                    type='submit' 
                                    color='primary' 
                                    className='btn-next'
                                    onClick={() => setFieldValue("actionType", "next")}
                                >
                                    <span className='align-middle d-sm-inline-block d-none'>Next</span>
                                    <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </Fragment>
    )
}

export default PersonalInfo;


