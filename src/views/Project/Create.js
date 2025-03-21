import { Fragment, useState, useEffect } from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardHeader, Label, Button, FormText } from 'reactstrap'
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import axiosInstance from '../../helper/axiosInstance';
import toast from 'react-hot-toast'
import Flatpickr from 'react-flatpickr'
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import makeAnimated from 'react-select/animated'
import { ChevronsLeft } from 'react-feather'

import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'

const Create = () => {
    const animatedComponents = makeAnimated();
    const navigate           = new useNavigate();
    const { user }           = useSelector((state) => state.LoginReducer);
    const { activeUsers }    = useSelector((state) => state.UsersReducer);

    const [componentVal, setComponentVal] = useState({
        userOptions : [],
        typeOptions : [
            { value: 'hourly', label: 'Hourly' },
            { value: 'fixed-cost', label: 'Fixed Cost' },
        ],
        statusOptions: [
            { value: 'active', label: 'Active' },
            { value: 'hold', label: 'Hold' },
            { value: 'closed', label: 'Closed' },
        ],
    });

    const [initialValues, setInitialValues] = useState({
        name          : '',
        type          : '',
        start_end_date: [],
        start_date    : '',
        end_date      : '',
        users_id      : [],
        status        : componentVal.statusOptions[0],
        created_by    : user._id
    });
    
    const validationSchema = Yup.object({
        name: Yup.string()
            .required()
            .max(50)
            .label('Name'),
        type: Yup.object()
            .required()
            .label('Type'),
        start_end_date: Yup.array()
            .test("required", "Start and End date is required", (value) => value && value.length > 0)
            .min(2, "Please select both start and end dates"),
        users_id: Yup.array()
            .min(1,'At least one user must be selected')
            .label('User'),
        status: Yup.object()
            .required()
            .label('Status'),
    })

    useEffect(() => {
        let options = activeUsers.map((val,key) => ({
            label: val.first_name+' '+val.last_name,    
            value: val._id, 
        }))

        setComponentVal(prevVal => ({
            ...prevVal,
            userOptions:options
        }))
    },[activeUsers])

    const onSubmit = async (values) => {
        try {
            const response = await axiosInstance.post(import.meta.env.VITE_BACKEND_URL+'projects/create', values);

            if(response.data.success){
                toast.success(response.data.message);
                navigate('/projects');
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
                            <CardTitle tag='h4'>
                                Add Project
                            </CardTitle>

                            <CardTitle tag='h4'>
                                <Button color='primary' size='sm' onClick={() => navigate(-1)}>
                                    <ChevronsLeft size={15} />
                                </Button>
                            </CardTitle>
                        </CardHeader>

                        <CardBody className='pt-1'>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                enableReinitialize={true}
                                onSubmit={onSubmit}
                            >
                                {({ errors, touched, setFieldValue, setTouched, setFieldError, setFieldTouched, validateField }) => (
                                    <Form>
                                        <Row>
                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='name'>
                                                    Name<span className="required">*</span>
                                                </Label>
                                
                                                <Field
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                                                    maxLength={50}
                                                    autoComplete="off"
                                                    autoFocus
                                                />

                                                <ErrorMessage name="name" component="div" className="invalid-feedback"/>
                                            </Col>

                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='user'>
                                                    Type<span className="required">*</span>
                                                </Label>

                                                <Select
                                                    name="type"
                                                    id="type"
                                                    theme={selectThemeColors}
                                                    className={`react-select ${(errors.type && touched.type) && 'is-invalid'}`}
                                                    classNamePrefix='select'
                                                    options={componentVal.typeOptions}
                                                    onChange={(option) => setFieldValue("type", option)}
                                                    onBlur={() => setFieldTouched("type", true)}
                                                    isClearable={false}
                                                />

                                                <ErrorMessage name="type" component="div" className="invalid-feedback"/>
                                            </Col>

                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='start_date'>
                                                    Start Date / End Date<span className="required">*</span>
                                                </Label>
                                
                                                <Flatpickr
                                                    name="start_end_date"
                                                    id="start_end_date"
                                                    className={`form-control ${errors.start_end_date && touched.start_end_date ? 'is-invalid rm-op' : ''}`}
                                                    onChange={(dates, dateStr, instance) => {
                                                        if (dates.length === 2 && (dates[0].toDateString() === dates[1].toDateString())) {
                                                            instance.clear();
                                                            return;
                                                        }
                                                
                                                        const formattedDates = dates.map(date => instance.formatDate(date, "Y-m-d"));
                                                        setFieldValue("start_end_date", formattedDates);
                                                        setFieldValue("start_date", formattedDates[0] || '');
                                                        setFieldValue("end_date", formattedDates[1] || '');
                                                        setFieldError("start_end_date", "");
                                                    }}
                                                    onBlur={() => {
                                                        setTimeout(() => {
                                                            setFieldTouched("start_end_date", true);
                                                            validateField("start_end_date");
                                                        },300)
                                                    }}
                                                    options={{
                                                        mode : 'range',
                                                        dateFormat: 'Y-m-d',
                                                        allowInput: false,
                                                        clickOpens: true,
                                                        disableMobile: true,
                                                    }}
                                                />

                                                <ErrorMessage name="start_end_date" component="div" className="invalid-feedback"/>
                                            </Col>

                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='user'>
                                                    Select User<span className="required">*</span>
                                                </Label>

                                                <Select
                                                    name="users_id"
                                                    id="users_id"
                                                    theme={selectThemeColors}
                                                    className={`react-select ${(errors.users_id && touched.users_id) && 'is-invalid'}`}
                                                    classNamePrefix='select'
                                                    closeMenuOnSelect={false}
                                                    components={animatedComponents}
                                                    isMulti
                                                    options={componentVal.userOptions}
                                                    onChange={(option) => setFieldValue("users_id", option)}
                                                    onBlur={() => setFieldTouched("users_id", true)}
                                                    isClearable={true}
                                                    styles={{
                                                        multiValue: (provided) => ({
                                                            ...provided,
                                                            maxWidth: "130px",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                        }),
                                                    }}
                                                />

                                                <ErrorMessage name="users_id" component="div" className="invalid-feedback"/>
                                            </Col>

                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='user'>
                                                    Status<span className="required">*</span>
                                                </Label>

                                                <Select
                                                    name="status"
                                                    id="status"
                                                    theme={selectThemeColors}
                                                    className={`react-select ${(errors.status && touched.status) && 'is-invalid'}`}
                                                    classNamePrefix='select'
                                                    options={componentVal.statusOptions}
                                                    defaultValue={componentVal.statusOptions[0]}
                                                    onChange={(option) => setFieldValue("status", option)}
                                                    onBlur={() => setFieldTouched("status", true)}
                                                    isClearable={false}
                                                />

                                                <ErrorMessage name="status" component="div" className="invalid-feedback"/>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col className='mt-1' sm='12'>
                                                <Button type='submit' className='me-1' color='primary'>
                                                    Save
                                                </Button>

                                                <Button type='button' className='me-1' color='secondary' onClick={() => navigate(-1)}>
                                                    Cancel
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

export default Create;