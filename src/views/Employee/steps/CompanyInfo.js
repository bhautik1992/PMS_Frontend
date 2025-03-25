import { Fragment, useState, useEffect } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Label, Row, Col, Input, Button } from 'reactstrap'
import '@styles/react/libs/react-select/_react-select.scss'
import Select from 'react-select'
import { selectThemeColors } from '@utils'

import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

const CompanyInfo = ({ stepper, additionalInfo, updateFormData}) => {
    const [componentVal, setComponentVal] = useState({
        desOptions: [],
        roleOptions: [],
    });

    const [initialValues, setInitialValues] = useState({
        designation_id: '',
        role_id       : '',
        username      : '',
        company_email : '',
    });

    const validationSchema = Yup.object({
        designation_id: Yup.object()
            .required()
            .label('Designation'),
        role_id: Yup.object()
            .required()
            .label('Role'),
        username: Yup.string()
            .required()
            .max(30)
            .label('User Name'),
        company_email: Yup.string()
            .required()
            .email()
            .max(50)
            .label('Email'),
    })

    useEffect(() => {
        if(additionalInfo.designations.length){
            const tempData = additionalInfo.designations.map(designation => ({
                value: designation._id,
                label: designation.name
            }));

            setComponentVal(prevVal => ({
                ...prevVal,
                desOptions: tempData
            }))
        }

        if(additionalInfo.allroles.length){
            const tempData = additionalInfo.allroles.map(role => ({
                value: role._id,
                label: role.name
            }));

            setComponentVal(prevVal => ({
                ...prevVal,
                roleOptions: tempData
            }))
        }
    },[])

    useEffect(() => {
        const isEmpty = Object.keys(additionalInfo.editUserInfo).length === 0;
        
        if(isEmpty == false){
            const selectedDes = componentVal.desOptions.find(
                option => option.value === additionalInfo.editUserInfo.designation_id
            ) || '';

            const selectedRole = componentVal.roleOptions.find(
                option => option.value === additionalInfo.editUserInfo.role_id
            ) || '';

            setInitialValues(prevVal => ({
                ...prevVal,
                designation_id: selectedDes,
                role_id       : selectedRole,
                username      : additionalInfo.editUserInfo.username,
                company_email : additionalInfo.editUserInfo.company_email,
            }))
        }
    },[additionalInfo.editUserInfo])

    const onSubmit = async (values) => {
        const inputs = {
            ...values,
            employee_code: additionalInfo.newcode,
        }

        await updateFormData('companyInfo',inputs);
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
                {({ errors, touched, setFieldValue, setFieldTouched, values }) => (
                    <Form>
                        <Row>
                            <Col md='6' className='mb-1'>
                                <Label className='form-label'>
                                    Employee Code
                                </Label>

                                <h4><p className='form-control-static text-primary'>
                                    {additionalInfo.newcode}
                                </p></h4>
                            </Col>

                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='designation_id'>
                                    Designation<span className="required">*</span>
                                </Label>

                                <Select
                                    name="designation_id"
                                    id="designation_id"
                                    theme={selectThemeColors}
                                    className={`react-select ${(errors.designation_id && touched.designation_id) && 'is-invalid'}`}
                                    classNamePrefix='select'
                                    options={componentVal.desOptions}
                                    value={values.designation_id}
                                    onChange={(option) => setFieldValue("designation_id", option)}
                                    onBlur={() => setFieldTouched("designation_id", true)}
                                />

                                <ErrorMessage name="designation_id" component="div" className="invalid-feedback"/>
                            </Col>
                        </Row>

                        <Row>
                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='role_id'>
                                    Role<span className="required">*</span>
                                </Label>

                                <Select
                                    name="role_id"
                                    id="role_id"
                                    theme={selectThemeColors}
                                    className={`react-select ${(errors.role_id && touched.role_id) && 'is-invalid'}`}
                                    classNamePrefix='select'
                                    options={componentVal.roleOptions}
                                    value={values.role_id}
                                    onChange={(option) => setFieldValue("role_id", option)}
                                    onBlur={() => setFieldTouched("role_id", true)}
                                />

                                <ErrorMessage name="role_id" component="div" className="invalid-feedback"/>
                            </Col>

                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='username'>
                                    User Name<span className="required">*</span>
                                </Label>
                
                                <Field
                                    type="text"
                                    name="username"
                                    id="username"
                                    className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                                    maxLength={30}
                                    autoComplete="off"
                                />

                                <ErrorMessage name="username" component="div" className="invalid-feedback"/>
                            </Col>
                        </Row>

                        <Row>
                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='company_email'>
                                    Email<span className="required">*</span>
                                </Label>
                
                                <Field
                                    type="text"
                                    name="company_email"
                                    id="company_email"
                                    className={`form-control ${errors.company_email && touched.company_email ? 'is-invalid' : ''}`}
                                    maxLength={50}
                                    autoComplete="off"
                                />

                                <ErrorMessage name="company_email" component="div" className="invalid-feedback"/>
                            </Col>
                        </Row>

                        <div className='d-flex justify-content-between'>
                            <Button color='primary' className='btn-prev' onClick={() => stepper.previous()}>
                                <ArrowLeft size={14} className='align-middle me-sm-25 me-0'></ArrowLeft>
                                <span className='align-middle d-sm-inline-block d-none'>Previous</span>
                            </Button>
                            
                            <Button type="submit" color='primary' className='btn-next'>
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

export default CompanyInfo;


