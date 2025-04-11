import { Fragment, useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Label, Row, Col, Button, Input } from 'reactstrap'
import '@styles/react/libs/react-select/_react-select.scss'

import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { Check, X } from 'react-feather'

const PersonalInfo = ({ stepper, additionalInfo, updateFormData }) => {
    const isEmpty = Object.keys(additionalInfo.editClientInfo).length === 0;

    const [initialValues, setInitialValues] = useState({
        first_name: '',
        last_name : '',
        email     : '',
        number    : '',
        is_active : true,
    })

    const validationSchema = Yup.object({
        first_name: Yup.string()
            .required()
            .max(30)
            .label('First Name'),
        last_name: Yup.string()
            .max(30)
            .label('Last Name'),
        email: Yup.string()
            .required()
            .email()
            .max(50)
            .label('Email'),
        number: Yup.string()
            .max(15)
            .label('Contact Number')
    })

    const handleNumericInput = (event, setFieldValue) => {
        const { name, value } = event.target;
        const numericValue = value.replace(/(?!^\+)[^\d]/g, "");
        setFieldValue(name, numericValue);
    }

    useEffect(() => {
        if(isEmpty == false){
            setInitialValues(prevVal => ({
                ...prevVal,
                first_name: additionalInfo.editClientInfo.first_name,
                last_name : additionalInfo.editClientInfo.last_name || '',
                email     : additionalInfo.editClientInfo.email,
                number    : additionalInfo.editClientInfo.number || '',
                is_active  : additionalInfo.editClientInfo.is_active,
            }))
        }
    },[additionalInfo.editClientInfo])

    const onSubmit = async (values) => {
        const isExit = (values.actionType === "saveExit")?true:false;
        await updateFormData(2, 'personalInfo', values, isExit);
        stepper.next()
    }

    const CustomLabel = ({ htmlFor }) => {
        return (
            <Label className='form-check-label' htmlFor={htmlFor}>
                <span className='switch-icon-left'>
                    <Check size={14} />
                </span>
            
                <span className='switch-icon-right'>
                    <X size={14} />
                </span>
          </Label>
        )
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
                                    Last Name
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
                                <Label className='form-label' for='email'>
                                    Email<span className="required">*</span>
                                </Label>
                
                                <Field
                                    type="text"
                                    name="email"
                                    id="email"
                                    className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                                    maxLength={50}
                                    autoComplete="off"
                                />

                                <ErrorMessage name="email" component="div" className="invalid-feedback"/>
                            </Col>

                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='number'>
                                    Contact Number
                                </Label>
                
                                <div className="input-group">
                                    <Field
                                        type="text"
                                        name="number"
                                        id="number"
                                        className={`form-control ${errors.number && touched.number ? 'is-invalid' : ''}`}
                                        maxLength={15}
                                        onChange={(event) => handleNumericInput(event, setFieldValue)}
                                        autoComplete={'off'}
                                    />

                                    <ErrorMessage name="number" component="div" className="invalid-feedback" />
                                </div>
                            </Col>
                        </Row>

                        <Row>
                            <Col md='2' className='mb-1'>
                                <Label className='form-label'>
                                    Status<span className="required">*</span>
                                </Label>

                                <div className='form-switch form-check-success'>
                                    <Field name="is_active">
                                        {({ field }) => (
                                            <Input
                                                type='switch'
                                                id='is_active'
                                                checked={field.value}
                                                onChange={(e) => setFieldValue("is_active", e.target.checked)}
                                            />
                                        )}
                                    </Field>
                                    <CustomLabel htmlFor='is_active' />
                                </div>
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


