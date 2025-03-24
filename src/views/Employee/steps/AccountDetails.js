import { Fragment, useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Label, Row, Col, Input, Button } from 'reactstrap'

import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

import Select from 'react-select'
import { selectThemeColors } from '@utils'
import '@styles/react/libs/react-select/_react-select.scss'

const AccountDetails = ({ stepper, additionalInfo, updateFormData }) => {
    const [initialValues, setInitialValues] = useState({
        bank_id       : '',
        account_number: '',
        ifsc_code     : '',
        branch_name   : '',
        account_type  : '',
        aadhar_card   : '',
        pan_card      : '',
    });

    const validationSchema = Yup.object({
        account_number: Yup.string()
            .notRequired()
            .max(20)
            .label('Account Number'),
        ifsc_code: Yup.string()
            .notRequired()
            .max(15)
            .label('IFSC Code'),
        branch_name: Yup.string()
            .notRequired()
            .max(40)
            .label('Branch Name'),
        aadhar_card: Yup.string()
            .notRequired()
            .min(12)
            .max(12)
            .label('Aadhar Card'),
        pan_card: Yup.string()
            .notRequired()
            .min(10)
            .max(10)
            .label('PAN Card'),
    })

    const [componentVal, setComponentVal] = useState({
        bankOptions: [],
        accTypeOptions: [
            {value: 'savings', label: 'Savings'},
            {value: 'current', label: 'Current'}
        ]
    });

    useEffect(() => {
        if(additionalInfo.allbanks.length){
            const tempData = additionalInfo.allbanks.map(bank => ({
                value: bank._id,
                label: bank.name
            }));

            setComponentVal(prevVal => ({
                ...prevVal,
                bankOptions: tempData
            }))
        }
    },[])

    const handleNumericInput = (event, setFieldValue) => {
        const { name, value } = event.target;
        const numericValue = value.replace(/[^0-9]/g, "");
        setFieldValue(name, numericValue);
    }

    const onSubmit = async (values) => {
        await updateFormData('bankInfo',values);
    }

    return (
        <Fragment>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={onSubmit}
            >
                {({ errors, touched, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <Row>
                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='bank_id'>
                                    Bank
                                </Label>

                                <Select
                                    name="bank_id"
                                    id="bank_id"
                                    theme={selectThemeColors}
                                    className={`react-select`}
                                    classNamePrefix='select'
                                    options={componentVal.bankOptions}
                                    onChange={(option) => setFieldValue("bank_id", option)}
                                    onBlur={() => setFieldTouched("bank_id", true)}
                                />
                            </Col>

                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='account_number'>
                                    Account Number
                                </Label>

                                <Field
                                    type="text"
                                    name="account_number"
                                    id="account_number"
                                    className={`form-control ${errors.account_number && touched.account_number ? 'is-invalid' : ''}`}
                                    onChange={(event) => handleNumericInput(event, setFieldValue)}
                                    maxLength={20}
                                    autoComplete="off"
                                />

                                <ErrorMessage name="account_number" component="div" className="invalid-feedback"/>
                            </Col>
                        </Row>

                        <Row>
                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='ifsc_code'>
                                    IFSC Code
                                </Label>

                                <Field
                                    type="text"
                                    name="ifsc_code"
                                    id="ifsc_code"
                                    className={`form-control ${errors.ifsc_code && touched.ifsc_code ? 'is-invalid' : ''}`}
                                    maxLength={15}
                                    autoComplete="off"
                                />

                                <ErrorMessage name="ifsc_code" component="div" className="invalid-feedback"/>
                            </Col>

                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='branch_name'>
                                    Branch Name
                                </Label>

                                <Field
                                    type="text"
                                    name="branch_name"
                                    id="branch_name"
                                    className={`form-control ${errors.branch_name && touched.branch_name ? 'is-invalid' : ''}`}
                                    maxLength={40}
                                />

                                <ErrorMessage name="branch_name" component="div" className="invalid-feedback"/>
                            </Col>
                        </Row>

                        <Row>
                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='account_type'>
                                    Account Type
                                </Label>

                                <Select
                                    name="account_type"
                                    id="account_type"
                                    theme={selectThemeColors}
                                    className={`react-select`}
                                    classNamePrefix='select'
                                    options={componentVal.accTypeOptions}
                                    onChange={(option) => setFieldValue("account_type", option)}
                                    onBlur={() => setFieldTouched("account_type", true)}
                                />
                            </Col>

                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='aadhar_card'>
                                    Aadhar Card
                                </Label>

                                <Field
                                    type="text"
                                    name="aadhar_card"
                                    id="aadhar_card"
                                    className={`form-control ${errors.aadhar_card && touched.aadhar_card ? 'is-invalid' : ''}`}
                                    onChange={(event) => handleNumericInput(event, setFieldValue)}
                                    maxLength={12}
                                />

                                <ErrorMessage name="aadhar_card" component="div" className="invalid-feedback"/>
                            </Col>
                        </Row>
                        
                        <Row>
                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='pan_card'>
                                    PAN Card
                                </Label>

                                <Field
                                    type="text"
                                    name="pan_card"
                                    id="pan_card"
                                    className={`form-control ${errors.pan_card && touched.pan_card ? 'is-invalid' : ''}`}
                                    maxLength={10}
                                />

                                <ErrorMessage name="pan_card" component="div" className="invalid-feedback"/>
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

export default AccountDetails
