import { Fragment, useState, useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Label, Row, Col, Input, Button } from 'reactstrap'

import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import '@styles/react/libs/react-select/_react-select.scss'

const Address = ({ stepper, updateFormData }) => {
    const [initialValues, setInitialValues] = useState({
        country: '',
        address: '',
    });

    const validationSchema = Yup.object({
        country: Yup.string()
            .required()
            .max(20)
            .label('Country'),
    })

    const onSubmit = async (values) => {
        await updateFormData(3,'addressInfo',values, true);
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
                        </Row>

                        <Row>
                            <Col md='12' className='mb-1'>
                                <Label className='form-label' for='address'>
                                    Address
                                </Label>
                
                                <Field
                                    as="textarea"
                                    name="address"
                                    id="address"
                                    rows="5"
                                    cols="5"
                                    className={"form-control"}
                                />
                            </Col>
                        </Row>

                        <div className='d-flex justify-content-between'>
                            <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
                                <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                                <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                            </Button>
                            
                            <Button type="submit" color='success' className='btn-submit'>
                                Save
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
    </Fragment>
  )
}

export default Address;
