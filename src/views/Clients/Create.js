import { Card, CardHeader, CardBody, CardTitle, Row, Col, Button } from "reactstrap";
import { Helmet } from 'react-helmet-async';
import { ChevronsLeft } from "react-feather";
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react'
import Wizard from '@components/wizard'
import PersonalInfo from './steps/PersonalInfo'
import Address from './steps/Address'
import toast from 'react-hot-toast'
import axiosInstance from '../../helper/axiosInstance';

import { START_LOADING, STOP_LOADING } from '../../services/constants';
import { useDispatch } from 'react-redux';

const Create = () => {
    const dispatch = useDispatch ();
    const navigate = new useNavigate();
    const ref      = useRef(null)
    
    const { id : clientId } = useParams();
    const[stepper,setStepper] = useState(null);

    const [additionalInfo, setAdditionalInfo] = useState({
        editClientInfo: {},
        currentStep:1,
        isSubmit: false,
    }) 

    const [formData, setFormData] = useState({
        personalInfo: {},
        addressInfo : {},
        clientId
    });

    const updateFormData = (step, type, data, isExit = false) => {
        setAdditionalInfo(prevVal => ({
            ...prevVal,
            currentStep:step
        }))
        
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
            const endPoint = clientId !== undefined?'clients/update':'clients/create';
            const response = await axiosInstance.post(endPoint, formData);
            
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

    useEffect(() => {
        if(clientId !== undefined){
            ( async () => {
                try{
                    const response = await axiosInstance.get('clients/edit/'+clientId);
                    
                    if(response.data.success){
                        setAdditionalInfo(prevVal => ({
                            ...prevVal,
                            editClientInfo:response.data.data,
                        }))
                    }
                }catch (error) {
                    const statusCode = error.response?.status || null;
                    const errorMessage = error.response?.data?.message || (error.request ? import.meta.env.VITE_NO_RESPONSE : import.meta.env.VITE_ERROR_MSG);
                
                    if ([404, 400].includes(statusCode)) {
                        navigate('/not-found');
                    } else {
                        toast.error(errorMessage);
                    }
                }
            })()
        }
    },[clientId])

    const steps = [{
        id      : 'personal-info',
        title   : 'Personal Info',
        subtitle: 'Add Personal Info',
        content : <PersonalInfo stepper={stepper} additionalInfo={additionalInfo} updateFormData={updateFormData} />
    },{
        id      : 'address-info',
        title   : 'Address Info',
        subtitle: 'Add Address Info',
        content : <Address stepper={stepper} additionalInfo={additionalInfo} updateFormData={updateFormData} />
    }]

    return (
        <>
            <Helmet>
                <title>{clientId !== undefined?'Edit Client':'Create Client'} | PMS</title>
            </Helmet>

            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>
                                {clientId !== undefined?'Edit Client':'Add Client'}
                            </CardTitle>

                            <CardTitle tag='h4'>
                                <Button color='secondary' size='sm' onClick={() => navigate(-1)}>
                                    <ChevronsLeft size={15} />
                                </Button>
                            </CardTitle>
                        </CardHeader>

                        <CardBody>
                            <div className='horizontal-wizard'>
                                <Wizard ref={ref} steps={steps} instance={el => setStepper(el)} />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </>
    );
};

export default Create;


