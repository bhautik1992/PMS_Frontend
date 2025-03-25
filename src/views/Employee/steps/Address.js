import { Fragment, useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Label, Row, Col, Input, Button } from 'reactstrap'

import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

const Address = ({ stepper, additionalInfo, updateFormData}) => {
    const [initialValues, setInitialValues] = useState({
        permanent_address      : '',
        temporary_address      : '',
        city                   : '',
        state                  : '',
        country                : '',
    })
    
    const validationSchema = Yup.object({
        country: Yup.string()
            .required()
            .max(20)
            .label('Country'),
        state: Yup.string()
            .required()
            .max(20)
            .label('State'),
        city: Yup.string()
            .required()
            .max(20)
            .label('City'),
        permanent_address : Yup.string()
            .required()
            .label('Permanent Address'),
    })
    
    useEffect(() => {
        const isEmpty = Object.keys(additionalInfo.editUserInfo).length === 0;
        
        if(isEmpty == false){
            setInitialValues(prevVal => ({
                ...prevVal,
                permanent_address: additionalInfo.editUserInfo.permanent_address,
                temporary_address: additionalInfo.editUserInfo.temporary_address,
                city             : additionalInfo.editUserInfo.city,
                state            : additionalInfo.editUserInfo.state,
                country          : additionalInfo.editUserInfo.country,
            }))
        }
    },[additionalInfo.editUserInfo])

    const onSubmit = async (values) => {
        await updateFormData('addressInfo', values);
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
                {({ errors, touched }) => (
                    <Form>
                        <Row>
                            <Col md='4' className='mb-1'>
                                <Label className='form-label' for='country'>
                                    Country<span className="required">*</span>
                                </Label>
                
                                <Field
                                    type="text"
                                    name="country"
                                    id="country"
                                    className={`form-control ${errors.country && touched.country ? 'is-invalid' : ''}`}
                                    maxLength={20}
                                />

                                <ErrorMessage name="country" component="div" className="invalid-feedback"/>
                            </Col>

                            <Col md='4' className='mb-1'>
                                <Label className='form-label' for='state'>
                                    State<span className="required">*</span>
                                </Label>
                
                                <Field
                                    type="text"
                                    name="state"
                                    id="state"
                                    className={`form-control ${errors.state && touched.state ? 'is-invalid' : ''}`}
                                    maxLength={20}
                                />

                                <ErrorMessage name="state" component="div" className="invalid-feedback"/>
                            </Col>

                            <Col md='4' className='mb-1'>
                                <Label className='form-label' for='city'>
                                    City<span className="required">*</span>
                                </Label>
                
                                <Field
                                    type="text"
                                    name="city"
                                    id="city"
                                    className={`form-control ${errors.city && touched.city ? 'is-invalid' : ''}`}
                                    maxLength={20}
                                />

                                <ErrorMessage name="city" component="div" className="invalid-feedback"/>
                            </Col>
                        </Row>

                        <Row>
                            <Col md='12' className='mb-1'>
                                <Label className='form-label' for='permanent_address'>
                                    Permanent Address<span className="required">*</span>
                                </Label>
                
                                <Field
                                    as="textarea"
                                    name="permanent_address"
                                    id="permanent_address"
                                    rows="5"
                                    cols="5"
                                    className={`form-control ${errors.permanent_address && touched.permanent_address ? 'is-invalid' : ''}`}
                                />

                                <ErrorMessage name="permanent_address" component="div" className="invalid-feedback"/>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col md='12' className='mb-1'>
                                <Label className='form-label' for='temporary_address'>
                                    Temporary Address
                                </Label>
                
                                <Field
                                    as="textarea"
                                    name="temporary_address"
                                    id="temporary_address"
                                    rows="5"
                                    cols="5"
                                    className={`form-control ${errors.temporary_address && touched.temporary_address ? 'is-invalid' : ''}`}
                                />

                                <ErrorMessage name="temporary_address" component="div" className="invalid-feedback"/>
                            </Col>
                        </Row>

                        <div className='d-flex justify-content-between'>
                            <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
                                <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                                <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                            </Button>

                            <Button type='submit' color='primary' className='btn-next'>
                                <span className='align-middle d-sm-inline-block d-none'>Next</span>
                                <ArrowRight size={14} className='align-middle ms-sm-25 ms-0'></ArrowRight>
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Fragment>
    )
}

export default Address;


