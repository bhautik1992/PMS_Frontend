import { Link } from 'react-router-dom'
import { useSkin } from '@hooks/useSkin'
import { ChevronLeft } from 'react-feather'
import { Row, Col, CardTitle, CardText, Label, Button } from 'reactstrap'
import illustrationsLight from '@src/assets/images/pages/reset-password-v2.svg'
import illustrationsDark from '@src/assets/images/pages/reset-password-v2-dark.svg'
import '@styles/react/pages/page-authentication.scss'

import InputPasswordToggle from "@components/input-password-toggle";
// import logo from "@src/assets/images/logo/logo_name.png";
const companyImage = localStorage.getItem('company_image');

import axiosInstance from "../helper/axiosInstance";
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { START_LOADING, STOP_LOADING } from '../services/constants';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { useLocation } from 'react-router-dom';

const ResetPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { skin } = useSkin()
    const source = skin === 'dark' ? illustrationsDark : illustrationsLight
    
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get("token");

    const validationSchema = Yup.object({
        password : Yup.string()
            .required()
            .min(8)
            .max(12)
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,12}$/,
                "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
            )
            .label('New Password'),
        cpassword: Yup.string()
            .required()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .label("Confirm Password"),
    })

    const initialValues = {
        password : '',
        cpassword: ''
    }

    const onSubmit = async (values) => {
        try{
            const data = {
                ...values,
                token
            }

            const response = await axiosInstance.post('reset_password', data);
            if(response.data.success){
                toast.success(response.data.message);
                navigate('/login');
            }
        }catch (error) {
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
        <div className='auth-wrapper auth-cover'>
            <Row className='auth-inner m-0'>
                <Link className='brand-logo' to='/login'>
                <img src={`http://localhost:5000/${companyImage}`}  height="28" style={{ width: "auto" }} alt="Company Logo" />

                </Link>
                
                <Col className='d-none d-lg-flex align-items-center p-5' lg='8' sm='12'>
                    <div className='w-100 d-lg-flex align-items-center justify-content-center px-5'>
                        <img className='img-fluid' src={source} alt='Login Cover' />
                    </div>
                </Col>
            
                <Col className='d-flex align-items-center auth-bg px-2 p-lg-5' lg='4' sm='12'>
                    <Col className='px-xl-2 mx-auto' sm='8' md='6' lg='12'>
                        <CardTitle tag='h2' className='fw-bold mb-1'>
                            Reset Password 🔒
                        </CardTitle>
            
                        <CardText className='mb-2'>
                            Enter a secure password with a combination of letters, numbers, and special characters.
                        </CardText>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            enableReinitialize={true}
                            onSubmit={onSubmit}
                        >
                            {({ errors, touched }) => (
                                <Form className='auth-reset-password-form mt-2'>
                                    <div className='mb-1'>
                                        <Label className='form-label' for='password'>
                                            New Password
                                        </Label>
                                        
                                        <Field
                                            name="password"
                                            id="password"
                                            component={InputPasswordToggle}
                                            className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                            maxLength={12}
                                        />

                                        <ErrorMessage name="password" component="div" className="invalid-feedback"/>
                                    </div>

                                    <div className='mb-1'>
                                        <Label className='form-label' for='cpassword'>
                                            Confirm Password
                                        </Label>                                    

                                        <Field
                                            name="cpassword"
                                            id="cpassword"
                                            component={InputPasswordToggle}
                                            className={`form-control ${errors.cpassword && touched.cpassword ? 'is-invalid' : ''}`}
                                        />

                                        <ErrorMessage name="cpassword" component="div" className="invalid-feedback"/>
                                    </div>
                                    
                                    <Button color='primary' block>
                                        Set New Password
                                    </Button>
                                
                                    <p className='text-center mt-2'>
                                        <Link to='/login'>
                                            <ChevronLeft className='rotate-rtl me-25' size={14} />
                                            <span className='align-middle'>Back to login</span>
                                        </Link>
                                    </p>
                                </Form>
                            )}
                        </ Formik>
                    </Col>
                </Col>
            </Row>
        </div>
    )
}

export default ResetPassword;


