import { Link } from "react-router-dom";
import { useSkin } from "@hooks/useSkin";
import { ChevronLeft } from "react-feather";
import { Row,Col,CardTitle,CardText,Label,Input,Button } from "reactstrap";
import illustrationsLight from "@src/assets/images/pages/forgot-password-v2.svg";
import illustrationsDark from "@src/assets/images/pages/forgot-password-v2-dark.svg";
import logo from "@src/assets/images/logo/logo_name.png";

import axiosInstance from "../helper/axiosInstance";
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { START_LOADING, STOP_LOADING } from '../services/constants';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

import "@styles/react/pages/page-authentication.scss";

const ForgotPassword = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { skin } = useSkin();
    const source = skin === "dark" ? illustrationsDark : illustrationsLight;

    const initialValues = {
        company_email: '',
    }

    const validationSchema = Yup.object({
        company_email: Yup.string()
            .required()
            .email()
            .max(50)
            .label('Email')
    })
    
    const onSubmit = async (values) => {
        try{
            dispatch({ type: START_LOADING })
            const response = await axiosInstance.post('forgot_password', values);

            if(response.data.success){
                dispatch({ type: STOP_LOADING })
                toast.success(response.data.message);
                navigate('/login');
            }
        }catch (error) {
            dispatch({ type: STOP_LOADING })
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
        <div className="auth-wrapper auth-cover">
            <Row className="auth-inner m-0">
                <Link className="brand-logo" to="/" onClick={(e) => e.preventDefault()}>
                    <img src={logo} height="28" style={{ width: "auto" }} alt="logo" />
                </Link>
        
                <Col className="d-none d-lg-flex align-items-center p-5" lg="8" sm="12">
                    <div className="w-100 d-lg-flex align-items-center justify-content-center px-5">
                        <img className="img-fluid" src={source} alt="Login Cover" />
                    </div>
                </Col>
        
                <Col className="d-flex align-items-center auth-bg px-2 p-lg-5" lg="4" sm="12">
                    <Col className="px-xl-2 mx-auto" sm="8" md="6" lg="12">
                        <CardTitle tag="h2" className="fw-bold mb-1">
                            Forgot Password? 🔒
                        </CardTitle>
            
                        <CardText className="mb-2">
                            Enter your email and we'll send you instructions to reset your
                            password
                        </CardText>
            
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                            {({ errors, touched }) => (
                                <Form className="auth-forgot-password-form mt-2">
                                    <div className="mb-1">
                                        <Label className="form-label" for="login-email">
                                            Email
                                        </Label>
                                        
                                        <Field
                                            type="text"
                                            name="company_email"
                                            id="company_email"
                                            className={`form-control ${errors.company_email && touched.company_email ? 'is-invalid' : ''}`}
                                            maxLength={50}
                                            placeholder="john@example.com"
                                            autoFocus
                                        />

                                        <ErrorMessage name="company_email" component="div" className="invalid-feedback"/>
                                    </div>
                    
                                    <Button type="submit" color="primary" block>
                                        Send Reset Link
                                    </Button>
                                </Form>
                            )}
                        </Formik>

                        <p className="text-center mt-2">
                            <Link to="/login">
                                <ChevronLeft className="rotate-rtl me-25" size={14} />
                                <span className="align-middle">Back to login</span>
                            </Link>
                        </p>
                    </Col>
                </Col>
            </Row>
        </div>
    );
};

export default ForgotPassword;


