import { Fragment, useState, useEffect } from 'react'
import 'cleave.js/dist/addons/cleave-phone.us'
import { Row, Col, Card, Input, Label, Button, CardBody, CardTitle, CardHeader, FormFeedback } from 'reactstrap'
import defaultAvatar from '../../assets/images/profile/default.jpg';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import axiosInstance from  '../../helper/axiosInstance';
import { useDispatch } from 'react-redux';
import { UPDATE_PROFILE } from '../../services/constants'
import toast from 'react-hot-toast'
import moment from 'moment';

const AccountTabs = () => {
    const { user } = useSelector((state) => state.LoginReducer);
    const [account,setAccount] = useState(user); 
    const [imagePreview, setImagePreview] = useState(defaultAvatar);
    const dispatch = useDispatch();

    const shiftOptions = [
        {value: 'first_shift', label: '09:00 To 06:30'},
        {value: 'second_shift', label: '11:00 To 08:30'}
    ];

    const validationSchema = Yup.object({
        first_name : Yup.string()
            .required()
            .max(30)
            .label('First Name'),
        last_name : Yup.string()
            .required()
            .max(30)
            .label('Last Name'),
        middle_name : Yup.string()
            .required()
            .max(30)
            .label('Middle Name'),
        username : Yup.string()
            .required()
            .max(30)
            .label('User Name'),
        profile_photo: Yup.mixed()
            .label('Profile Photo')
            .test("fileFormat", "Only JPG, JPEG, or PNG files are allowed", (file) => {
                if (!file) return true;
    
                const fileType = file.type.trim().toLowerCase();
                return ["image/jpg", "image/jpeg", "image/png"].includes(fileType);
            })
            .test("fileSize", "File size must be less than 3MB", (file) => {
                if (!file) return true;
                return file.size <= 3 * 1024 * 1024;
            }),
        company_email : Yup.string()
            .required()
            .email()
            .max(50)
            .label('Company Email'),
        personal_email : Yup.string()
            .required()
            .email()
            .max(50)
            .label('Personal Email'),
        permanent_address : Yup.string()
            .required()
            .label('Permanent Address'),
        mobile_number : Yup.string()
            .required()
            .max(10)
            .label('Mobile Number'),
        alternate_mobile_number : Yup.string()
            .required()
            .max(10)
            .label('Alternate Mobile Number'),
        emergency_contact : Yup.string()
            .required()
            .max(10)
            .label('Emergency Contact'),
        gender: Yup.string()
            .required()
            .label('Gender'),
        country: Yup.string()
            .required()
            .label('Country'),
        state: Yup.string()
            .required()
            .label('State'),
        city: Yup.string()
            .required()
            .max(20)
            .label('City'),
    })

    const initialValues = {
        first_name             : account.first_name,
        last_name              : account.last_name,
        middle_name            : account.middle_name,
        birth_date             : moment(account.birth_date, "YYYY-MM-DD").format("DD MMM, YYYY"),
        username               : account.username,
        profile_photo          : '',
        company_email          : account.company_email,
        personal_email         : account.personal_email,
        permanent_address      : account.permanent_address,
        temporary_address      : (account.temporary_address === null)?'':account.temporary_address,
        mobile_number          : account.mobile_number,
        alternate_mobile_number: account.alternate_mobile_number,
        emergency_contact      : account.emergency_contact,
        shift_time             : account.shift_time,
        gender                 : account.gender,
        designation            : account.designation_id.name,
        role                   : account.role_id.name,
        reporting_to           : account?.reporting_to?._id,
        reporting_name         : account?.reporting_to?.first_name+' '+account?.reporting_to?.last_name+' ('+account?.reporting_to?.designation_id?.name+')',
        country                : account.country,
        state                  : account.state,
        city                   : account.city,
    }
    
    const match = shiftOptions.find(option => option.value === initialValues.shift_time);

    const handleFileChange = (event, setFieldValue, setTouched, setErrors) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes  = ["image/jpg", "image/jpeg", "image/png"];
        const maxSize       = 3 * 1024 * 1024;
        setTouched("profile_photo", true);

        if (!allowedTypes.includes(file.type)) {
            setErrors({ profile_photo: "Only JPG, JPEG, or PNG files are allowed" });
            setFieldValue("profile_photo", '');

            toast.error('Only JPG, JPEG, or PNG files are allowed')
            return;
        }
        
        if (file.size > maxSize) {
            setErrors({ profile_photo: "File size must be less than 3MB" });
            setFieldValue("profile_photo", '');

            toast.error('File size must be less than 3MB')
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);

        setFieldValue("profile_photo", file);
    }

    const onSubmit = async (values) => {
        try {
            const response = await axiosInstance.post('user/profile/'+account._id, values, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if(response.data.success){
                dispatch({ type: UPDATE_PROFILE, data:response.data.data });
                toast.success(response.data.message);
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

    const handleNumericInput = (event, setFieldValue) => {
        const { name, value } = event.target;
        const numericValue = value.replace(/[^0-9]/g, "");
        setFieldValue(name, numericValue);
    }
    
    useEffect(() => {
        if(account?.profile_photo){
            setImagePreview(import.meta.env.VITE_BACKEND_ASSETS_URL+account.profile_photo)
        }
    },[account]);

       const [countries, setCountries] = useState([]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axiosInstance.get('countrys');
                const countries = response.data.data.countries;
                setCountries(countries);
            } catch (error) {
                console.error('Failed to fetch countries:', error);
            }
        };
    
        fetchCountries();
    }, []);


    const [states, setStates] = useState([]);

    return (
        <Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Profile Details</CardTitle>
                </CardHeader>
        
                <CardBody className='py-2 my-25'>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        enableReinitialize={true}
                        onSubmit={onSubmit}
                    >
                    {({ errors, touched, setFieldValue, values }) => {
                                        {
                                            useEffect(() => {
                                                const fetchStates = async () => {
                                                    if (!values.country) {
                                                        setStates([]);
                                                        return;
                                                    }
                                    
                                                    try {
                                                        const response = await axiosInstance.get(`/states/${values.country}`);
                                                        const fetchedStates = response.data.data;
                                                        setStates(fetchedStates);
                                                    } catch (error) {
                                                        console.error('Failed to fetch states:', error);
                                                    }
                                                };
                                                fetchStates();
                                            }, [values.country]);

                                        }
                            return (                            
                            <Form>
                                <div className='d-flex'>
                                    <div className='me-25'>
                                        <img className='rounded me-50' src={imagePreview} alt='Profile Image' height='100' width='100' />
                                    </div>
                        
                                    <div className='d-flex align-items-end mt-75 ms-1'>
                                        <div>
                                            <Button tag={Label} className='mb-75 me-75' size='sm' color='primary'>
                                                Select
                                                <input
                                                    type="file"
                                                    name="profile_photo"
                                                    id="profile_photo"
                                                    hidden
                                                    accept="image/jpg, image/jpeg, image/png"
                                                    onChange={(event) => handleFileChange(event, setFieldValue, setTouched, setErrors)}
                                                />    
                                            </Button>

                                            <p className='mb-0'>Allowed JPG, JPEG, or PNG. Max size of 3MB</p>
                                            <ErrorMessage name="profile_photo" component="div" className="invalid-feedback d-block" />
                                        </div>
                                    </div>
                                </div>
                                
                                <Row>
                                    <Col md='4'>
                                        <Label className='form-label' for='first_name'>
                                            First Name<span className="required">*</span>
                                        </Label>
                        
                                        <Field
                                            type="text"
                                            name="first_name"
                                            id="first_name"
                                            className={`form-control ${errors.first_name && touched.first_name ? 'is-invalid' : ''}`}
                                            maxLength={30}
                                            autoFocus
                                        />

                                        <ErrorMessage name="first_name" component="div" className="invalid-feedback"/>
                                    </Col>

                                    <Col md='4'>
                                        <Label className='form-label' for='last_name'>
                                            Last Name<span className="required">*</span>
                                        </Label>
                        
                                        <Field
                                            type="text"
                                            name="last_name"
                                            id="last_name"
                                            className={`form-control ${errors.last_name && touched.last_name ? 'is-invalid' : ''}`}
                                            maxLength={30}
                                        />

                                        <ErrorMessage name="last_name" component="div" className="invalid-feedback"/>
                                    </Col>

                                    <Col md='4'>
                                        <Label className='form-label' for='middle_name'>
                                            Middle Name<span className="required">*</span>
                                        </Label>
                        
                                        <Field
                                            type="text"
                                            name="middle_name"
                                            id="middle_name"
                                            className={`form-control ${errors.middle_name && touched.middle_name ? 'is-invalid' : ''}`}
                                            maxLength={30}
                                        />

                                        <ErrorMessage name="middle_name" component="div" className="invalid-feedback"/>
                                    </Col>
                                </Row>
                                
                                <Row className='mt-1'>
                                    <Col md='4'>
                                        <Label className='form-label' for='username'>
                                            Birth Date
                                        </Label>

                                        <h6><p className='form-control-static text-primary'>
                                            {initialValues.birth_date}
                                        </p></h6>
                                    </Col>

                                    <Col md='4'>
                                        <Label className='form-label' for='username'>
                                            User Name
                                            {/* <span className="required">*</span> */}
                                        </Label>
                        
                                        <h6><p className='form-control-static text-primary'>
                                            {initialValues.username}
                                        </p></h6>

                                        {/* <Field
                                            type="text"
                                            name="username"
                                            id="username"
                                            className={`form-control ${errors.username && touched.username ? 'is-invalid' : ''}`}
                                            maxLength={30}
                                            tabIndex="-1"
                                            readOnly
                                        />
                                        
                                        <ErrorMessage name="username" component="div" className="invalid-feedback"/> */}
                                    </Col>

                                    <Col md='4'>
                                        <Label className='form-label' for='company_email'>
                                            Company Email
                                            {/* <span className="required">*</span> */}
                                        </Label>
                        
                                        <h6><p className='form-control-static text-primary'>
                                            {initialValues.company_email}
                                        </p></h6>

                                        {/* <Field
                                            type="text"
                                            name="company_email"
                                            id="company_email"
                                            className={`form-control ${errors.company_email && touched.company_email ? 'is-invalid' : ''}`}
                                            maxLength={50}
                                            readOnly
                                            tabIndex="-1"
                                        />

                                        <ErrorMessage name="company_email" component="div" className="invalid-feedback"/> */}
                                    </Col>
                                </Row>
                                
                                <Row className='mt-1'>
                                    <Col md='4'>
                                        <Label className='form-label' for='personal_email'>
                                            Personal Email
                                            {/* <span className="required">*</span> */}
                                        </Label>
                        
                                        <h6><p className='form-control-static text-primary'>
                                            {initialValues.personal_email}
                                        </p></h6>

                                        {/* <Field
                                            type="text"
                                            name="personal_email"
                                            id="personal_email"
                                            className={`form-control ${errors.personal_email && touched.personal_email ? 'is-invalid' : ''}`}
                                            maxLength={50}
                                            readOnly
                                            tabIndex="-1"
                                        />

                                        <ErrorMessage name="personal_email" component="div" className="invalid-feedback"/> */}
                                    </Col>

                                    <Col md='4'>
                                        <Label className='form-label' for='mobile_number'>
                                            Mobile Number
                                            {/* <span className="required">*</span> */}
                                        </Label>
                        
                                        <h6><p className='form-control-static text-primary'>
                                            {initialValues.mobile_number}
                                        </p></h6>

                                        {/* <div className="input-group">
                                            <span className={`readonly input-group-text ${errors.mobile_number && touched.mobile_number ? 'is-invalid' : ''}`}>+91</span>

                                            <Field
                                                type="text"
                                                name="mobile_number"
                                                id="mobile_number"
                                                className={`form-control ${errors.mobile_number && touched.mobile_number ? 'is-invalid' : ''}`}
                                                maxLength={10}
                                                onChange={(event) => handleNumericInput(event, setFieldValue)}
                                                readOnly
                                                tabIndex="-1"
                                            />

                                            <ErrorMessage name="mobile_number" component="div" className="invalid-feedback" />
                                        </div> */}
                                    </Col>

                                    <Col md='4'>
                                        <Label className='form-label' for='alternate_mobile_number'>
                                            Alternate Mobile Number
                                            {/* <span className="required">*</span> */}
                                        </Label>
                        
                                        <h6><p className='form-control-static text-primary'>
                                            {initialValues.alternate_mobile_number}
                                        </p></h6>

                                        {/* <div className="input-group">
                                            <span className={`readonly input-group-text ${errors.alternate_mobile_number && touched.alternate_mobile_number ? 'is-invalid' : ''}`}>+91</span>

                                            <Field
                                                type="text"
                                                name="alternate_mobile_number"
                                                id="alternate_mobile_number"
                                                className={`form-control ${errors.alternate_mobile_number && touched.alternate_mobile_number ? 'is-invalid' : ''}`}
                                                maxLength={10}
                                                onChange={(event) => handleNumericInput(event, setFieldValue)}
                                                readOnly
                                                tabIndex="-1"
                                            />

                                            <ErrorMessage name="alternate_mobile_number" component="div" className="invalid-feedback" />
                                        </div> */}
                                    </Col>
                                </Row>
                                
                                <Row className='mt-1'>
                                    <Col md='4'>
                                        <Label className='form-label' for='emergency_contact'>
                                            Emergency Contact
                                            {/* <span className="required">*</span> */}
                                        </Label>
                        
                                        <h6><p className='form-control-static text-primary'>
                                            {initialValues.emergency_contact}
                                        </p></h6>

                                        {/* <div className="input-group">
                                            <span className={`readonly input-group-text ${errors.emergency_contact && touched.emergency_contact ? 'is-invalid' : ''}`}>+91</span>

                                            <Field
                                                type="text"
                                                name="emergency_contact"
                                                id="emergency_contact"
                                                className={`form-control ${errors.emergency_contact && touched.emergency_contact ? 'is-invalid' : ''}`}
                                                maxLength={10}
                                                onChange={(event) => handleNumericInput(event, setFieldValue)}
                                                readOnly
                                                tabIndex="-1"
                                            />

                                            <ErrorMessage name="emergency_contact" component="div" className="invalid-feedback" />
                                        </div> */}
                                    </Col>

                                    <Col md='4'>
                                        <Label className='form-label' for='shift_time'>
                                            Shift Time
                                        </Label>
                                        
                                        <h6><p className='form-control-static text-primary'>
                                            {match?.label}
                                        </p></h6>
                                    </Col>

                                    <Col md='4'>
                                        <Label className='form-label' for='designation'>
                                            Designation
                                        </Label>

                                        <h6><p className='form-control-static text-primary'>
                                            {initialValues.designation}
                                        </p></h6>
                                    </Col>
                                </Row>
                                
                                <Row className='mt-1'>
                                    <Col md='4'>
                                        <Label className='form-label' for='role'>
                                            Role
                                        </Label>

                                        <h6><p className='form-control-static text-primary'>
                                            {initialValues.role}
                                        </p></h6>
                                    </Col>

                                    <Col md='4'>
                                        <Label className='form-label' for='reporting_name'>
                                            Reporting To
                                        </Label>

                                        <h6><p className='form-control-static text-primary'>
                                            {initialValues.reporting_name}
                                        </p></h6>
                                    </Col>

                                   <Col md='4' className='mb-1'>
                                <Label className='form-label' for='country'>
                                    Country<span className="required">*</span>
                                </Label>

                                <Field
                                as="select"
                                name="country"
                                id="country"
                                className={`form-control ${errors.country && touched.country ? 'is-invalid' : ''}`}
                                maxLength={20}
                                >
                                <option value="">Select country</option>
                                {countries.map((country) => (
                                <option key={country._id} value={country._id}>
                                    {country.name}
                                </option>
                                ))}
                                </Field>

                                <ErrorMessage name="country" component="div" className="invalid-feedback"/>
                            </Col>

                                </Row>
                                
                                <Row>
                                   

                            <Col md='4' className='mb-1'>
                                <Label className='form-label' for='state'>
                                    State<span className="required">*</span>
                                </Label>
                
                                 <Field
                                as="select"
                                name="state"
                                id="state"
                                className={`form-control ${errors.state && touched.state ? 'is-invalid' : ''}`}
                                maxLength={20}
                                >
                                <option value="">Select state</option>
                                {states.map((state) => (
                                <option key={state._id} value={state._id}>
                                    {state.name}
                                </option>
                                ))}
                                </Field>
                                <ErrorMessage name="state" component="div" className="invalid-feedback"/>
                            </Col>


                                    <Col md='4'>
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
                                
                                <Row className='mt-1'>
                                    <Col sm='6'>
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

                                    <Col sm='6'>
                                        <Label className='form-label' for='temporary_address'>
                                            Temporary Address
                                        </Label>
                        
                                        <Field
                                            as="textarea"
                                            name="temporary_address"
                                            id="temporary_address"
                                            rows="5"
                                            cols="5"
                                            className={`form-control`}
                                        />
                                    </Col>
                                </Row>
                                
                                <Row className='mt-1'>
                                    <Col sm='4'>
                                        <Label className='form-label' for='gender'>
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

                                    <Col className='mt-2' sm='12'>
                                        <Button type='submit' className='me-1' color='primary'>
                                            Update
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        )}}
                    </Formik>
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default AccountTabs;
