// ** React Imports
import { useSkin } from "@hooks/useSkin";
import { Link } from "react-router-dom";

import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast'
import { useDispatch } from "react-redux";
import { login } from '../services/actions/LoginAction';
import { getUsers } from '../services/actions/UsersAction';
import InputPasswordToggle from "@components/input-password-toggle";
import {Row,Col,CardTitle,CardText,Label,Input,Button} from "reactstrap";
import illustrationsLight from "@src/assets/images/pages/login-v2.svg";
import illustrationsDark from "@src/assets/images/pages/login-v2-dark.svg";
import "@styles/react/pages/page-authentication.scss";
import axiosInstance from  '../helper/axiosInstance'; 
import logo from "@src/assets/images/logo/logo_name.png";
import { SYSTEM_SETTING, DESIGNATIONS_LIST, ROLES_ALL, BANKS_ALL } from '../services/constants';

const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { skin } = useSkin();
    const source = skin === "dark" ? illustrationsDark : illustrationsLight;

    const initialValues = {
        company_email: '',
        password     : ''
    }

    const validationSchema = Yup.object({
        company_email: Yup.string()
            .required()
            .email()
            .max(50)
            .label('Email'),
        password: Yup.string()
            .required()
            .label('Password')
    })

    const onSubmit = async (values) => {
        try{
            const response = await axiosInstance.post('login', values);

            if(response.data.success){
                dispatch(login(response.data));
                dispatch(getUsers());
                dispatch({type: SYSTEM_SETTING,data:response.data.settings});
                dispatch({type: DESIGNATIONS_LIST,data:response.data.designation});
                dispatch({type: ROLES_ALL,data:response.data.roles});
                dispatch({type: BANKS_ALL,data:response.data.banks});
                
                toast.success(response.data.message);
                navigate('/home');
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
                            Welcome to PMS! 👋
                        </CardTitle>
                        
                        <CardText className="mb-2">
                            Please sign-in to your account and start the adventure
                        </CardText>

                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                        >
                            {({ errors, touched }) => (
                                <Form
                                    className="auth-login-form mt-2"
                                >
                                    <div className="mb-1">
                                        <Label className="form-label" for="email">Email</Label>
                                        
                                        <Field
                                            type="text"
                                            name="company_email"
                                            id="company_email"
                                            placeholder="john@example.com"
                                            maxLength={50}
                                            autoFocus
                                            className={`form-control ${errors.company_email && touched.company_email ? 'is-invalid' : ''}`}
                                        />

                                        <ErrorMessage name="company_email" component="div" className="invalid-feedback"/>
                                    </div>
                            
                                    <div className="mb-1">
                                        <div className="d-flex justify-content-between">
                                            <Label className="form-label" for="password">Password</Label>
                                            <Link to="/forgot-password">
                                                <small>Forgot Password?</small>
                                            </Link>
                                        </div>
                                        
                                        <Field
                                            name="password"
                                            id="password"
                                            component={InputPasswordToggle}
                                            className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                                        />

                                        <ErrorMessage name="password" component="div" className="invalid-feedback"/>
                                    </div>
                                
                                    <div className="form-check mb-1">
                                        <Input type="checkbox" id="remember-me" />
                                        <Label className="form-check-label" for="remember-me">Remember Me</Label>
                                    </div>
                            
                                    <Button type='submit' color="primary" block>
                                        Sign in
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Col>
                </Col>
            </Row>
        </div>
    );
};

export default Login;


