import { Fragment, useState, useEffect, useRef } from 'react'
import { ArrowLeft, ArrowRight } from 'react-feather'
import { Label, Row, Col, Input, Button } from 'reactstrap'
import '@styles/react/libs/react-select/_react-select.scss'
import Select from 'react-select'
import { selectThemeColors } from '@utils'

import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';

const CompanyInfo = ({ stepper, additionalInfo, updateFormData}) => {
    const isEmpty = Object.keys(additionalInfo.editUserInfo).length === 0;
    const firstInputRef = useRef(null);

    const { activeUsers } = useSelector((state) => state.UsersReducer);
    const [reduxLoaded, setReduxLoaded] = useState(false);
    
    const [componentVal, setComponentVal] = useState({
        userOptions: [],
        desOptions : [],
        roleOptions: [],
        shiftOptions: [
            {value: 'first_shift', label: '09:00 To 06:30'},
            {value: 'second_shift', label: '11:00 To 08:30'}
        ]
    });

    const [initialValues, setInitialValues] = useState({
        shift_time    : '',
        designation_id: '',
        role_id       : '',
        username      : '',
        company_email : '',
        reporting_to  : '',
    });

    const validationSchema = Yup.object({
        shift_time: Yup.object()
            .required()
            .label('Shift Time'),
        designation_id: Yup.object()
            .required()
            .label('Designation'),
        role_id: Yup.object()
            .required()
            .label('Role'),
        reporting_to: Yup.object()
            .required()
            .label('Reporting Person'),
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
        const temp = (
            activeUsers.length > 0
        )

        if(temp){
            setReduxLoaded(true);
        }
    },[activeUsers])

    useEffect(() => {
        if(reduxLoaded){
            let options1 = activeUsers.map((val,key) => ({
                label: val.first_name+' '+val.last_name+' ('+val?.designation_id?.name+')',    
                value: val._id, 
            }))
    
            setComponentVal(prevVal => ({
                ...prevVal,
                userOptions:options1
            }))
        }
    },[reduxLoaded])

    useEffect(() => {
        if(isEmpty == false){
            const selectedshift = componentVal.shiftOptions.find(
                option => option.value === additionalInfo.editUserInfo.shift_time
            ) || '';

            const selectedDes = componentVal.desOptions.find(
                option => option.value === additionalInfo.editUserInfo.designation_id
            ) || '';

            const selectedRole = componentVal.roleOptions.find(
                option => option.value === additionalInfo.editUserInfo.role_id
            ) || '';

            const selectedReporting = componentVal.userOptions.find(
                option => option.value === additionalInfo.editUserInfo.reporting_to
            ) || '';

            setInitialValues(prevVal => ({
                ...prevVal,
                shift_time    : selectedshift,
                designation_id: selectedDes,
                role_id       : selectedRole,
                reporting_to  : selectedReporting,
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

        const isExit = (values.actionType === "saveExit")?true:false;
        await updateFormData(4,'companyInfo',inputs,isExit);
        stepper.next()
    }

    useEffect(() => {
        if(additionalInfo.currentStep == 3){
            setTimeout(() => {
                if (firstInputRef.current) {
                    firstInputRef.current.focus();
                }
            }, 100)
        }
    },[additionalInfo.currentStep])

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
                                    Collaborator Code
                                </Label>

                                <h4><p className='form-control-static text-primary'>
                                    {additionalInfo.newcode}
                                </p></h4>
                            </Col>

                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='shift_time'>
                                    Shift Time<span className="required">*</span>
                                </Label>

                                <Select
                                    ref={firstInputRef}
                                    name="shift_time"
                                    id="shift_time"
                                    theme={selectThemeColors}
                                    className={`react-select ${(errors.shift_time && touched.shift_time) && 'is-invalid'}`}
                                    classNamePrefix='select'
                                    options={componentVal.shiftOptions}
                                    value={values.shift_time}
                                    onChange={(option) => setFieldValue("shift_time", option)}
                                    onBlur={() => setFieldTouched("shift_time", true)}
                                />

                                <ErrorMessage name="shift_time" component="div" className="invalid-feedback"/>
                            </Col>
                        </Row>

                        <Row>
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
                        </Row>
                        
                        <Row>
                            <Col md='6' className='mb-1'>
                                <Label className='form-label' for='reporting_to'>
                                    Reporting To<span className="required">*</span>
                                </Label>

                                <Select
                                    name="reporting_to"
                                    id="reporting_to"
                                    theme={selectThemeColors}
                                    className={`react-select ${(errors.reporting_to && touched.reporting_to) && 'is-invalid'}`}
                                    classNamePrefix='select'
                                    options={componentVal.userOptions}
                                    value={values.reporting_to}
                                    onChange={(option) => setFieldValue("reporting_to", option)}
                                    onBlur={() => setFieldTouched("reporting_to", true)}
                                />

                                <ErrorMessage name="reporting_to" component="div" className="invalid-feedback"/>
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
                            
                            <div className=''>
                                {isEmpty == false &&
                                    <Button 
                                        type="submit" 
                                        color='success' 
                                        className='mx-1'
                                        onClick={() => setFieldValue("actionType", "saveExit")}
                                    >
                                        <span className='align-middle d-sm-inline-block d-none'>Save & Exit</span>
                                    </Button>
                                }

                                <Button 
                                    type="submit" 
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

export default CompanyInfo;


