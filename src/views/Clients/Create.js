import { Card, CardHeader, CardTitle, Row, Col, Button } from "reactstrap";
import { Helmet } from 'react-helmet-async';
import { ChevronsLeft } from "react-feather";
import { useNavigate, useParams } from 'react-router-dom';
import { Fragment, useState, useEffect, useRef } from 'react'
import Wizard from '@components/wizard'
import PersonalInfo from './steps/PersonalInfo'
import Address from './steps/Address'
import toast from 'react-hot-toast'
import axiosInstance from '../../helper/axiosInstance';

import { START_LOADING, STOP_LOADING } from '../../services/constants';
import { useDispatch } from 'react-redux';

const Home = () => {
    const dispatch = useDispatch ();
    const navigate = new useNavigate();
    const ref      = useRef(null)
    const[stepper,setStepper] = useState(null);

    const [additionalInfo, setAdditionalInfo] = useState({
        isSubmit: false,
    }) 

    const [formData, setFormData] = useState({
        personalInfo: {},
        addressInfo : {}
    });

    const updateFormData = (step, type, data, isExit = false) => {
        setFormData(prev => ({ 
            ...prev, 
            [type]: data,
        }));

        if(type === 'addressInfo' || isExit){
            setAdditionalInfo(prevVal => ({
                ...prevVal,
                isSubmit: true
            }))
        }
    }

    useEffect(() => {
        if(additionalInfo.isSubmit){
            handleSubmit();
        }
    },[additionalInfo.isSubmit])

    const handleSubmit  = async () => {
        try {
            dispatch({ type: START_LOADING })
            const response = await axiosInstance.post('clients/create', formData);
            
            if(response.data.success){
                toast.success(response.data.message);
                dispatch({ type: STOP_LOADING })
                navigate('/clients');
            }
        } catch (error) {
            dispatch({ type: STOP_LOADING })
            setAdditionalInfo(prevVal => ({...prevVal,isSubmit: false}));
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

    const steps = [{
        id      : 'personal-info',
        title   : 'Personal Info',
        subtitle: 'Add Personal Info',
        content : <PersonalInfo stepper={stepper} updateFormData={updateFormData} />
    },{
        id      : 'address-info',
        title   : 'Address Info',
        subtitle: 'Add Address Info',
        content : <Address stepper={stepper} updateFormData={updateFormData} />
    }]

    return (
        <>
            <Helmet>
                <title>Create Client | PMS</title>
            </Helmet>

            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>
                                Add Client
                            </CardTitle>

                            <CardTitle tag='h4'>
                                <Button color='secondary' size='sm' onClick={() => navigate(-1)}>
                                    <ChevronsLeft size={15} />
                                </Button>
                            </CardTitle>
                        </CardHeader>
                    </Card>

                    <div className='horizontal-wizard'>
                        <Wizard ref={ref} steps={steps} instance={el => setStepper(el)} />
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default Home;


