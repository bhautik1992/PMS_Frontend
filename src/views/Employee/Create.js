import { Fragment, useState, useEffect, useRef } from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardHeader, Label, Button, FormText } from 'reactstrap'
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { ChevronsLeft } from 'react-feather'

import Wizard from '@components/wizard'
import Address from './steps/Address'
import PersonalInfo from './steps/PersonalInfo'
import CompanyInfo from './steps/CompanyInfo'
import AccountDetails from './steps/AccountDetails'

import axiosInstance from  '../../helper/axiosInstance';
import toast from 'react-hot-toast'

import { START_LOADING, STOP_LOADING } from '../../services/constants';
import { useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet-async';

const Create = () => {
    const dispatch         = useDispatch ();
    const ref              = useRef(null)
    const navigate         = new useNavigate();
    const { user }         = useSelector((state) => state.LoginReducer);
    const { settings }     = useSelector((state) => state.SettingReducer);
    const { designations } = useSelector((state) => state.DesignationReducer);
    const { allroles }     = useSelector((state) => state.RolesReducer);
    const { allbanks }     = useSelector((state) => state.BanksReducer);
    const [stepper, setStepper] = useState(null)

    const { id: userId } = useParams();

    const [additionalInfo, setAdditionalInfo] = useState({
        currentStep:1,
        newcode:'',
        designations,
        allroles,
        allbanks,
        editUserInfo: {},
        editBankInfo: {},
        isSubmit: false,
    })    

    const [formData, setFormData] = useState({
        personalInfo: {},
        addressInfo : {},
        companyInfo : {},
        bankInfo    : {},
        userId
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

        if(type === 'bankInfo' || isExit){
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
            const endPoint = userId !== undefined?'user/update':'user';
            const response = await axiosInstance.post(endPoint, formData);
            
            if(response.data.success){
                toast.success(response.data.message);
                dispatch({ type: STOP_LOADING })
                navigate('/employee');
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
        if(settings?.emp_code && userId === undefined){
            (async() => {
                try {
                    const response = await axiosInstance.get('user/generate/employee_code');
                    if(response.data.success){
                        setAdditionalInfo(prevVal => ({
                            ...prevVal,
                            newcode: response.data.data.emp_code
                        }))
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
            })();
        }
    },[settings,userId])

    useEffect(() => {
        if(userId !== undefined){
            ( async () => {
                try{
                    const response = await axiosInstance.get('user/edit/'+userId);

                    if(response.data.success){
                        setAdditionalInfo(prevVal => ({
                            ...prevVal,
                            newcode:response.data.data.user.employee_code,
                            editUserInfo:response.data.data.user,
                            editBankInfo:response.data.data.bank_detail,
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
    },[userId])

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
    },{
        id      : 'company-info',
        title   : 'Company Info',
        subtitle: 'Add Company Info',
        content : <CompanyInfo stepper={stepper} additionalInfo={additionalInfo} updateFormData={updateFormData} />
    },{
        id      : 'bank-info',
        title   : 'Bank Info',
        subtitle: 'Add Bank Info',
        content : <AccountDetails stepper={stepper} additionalInfo={additionalInfo} updateFormData={updateFormData} />
    }]

    return (
        <Fragment>
            <Helmet>
                <title>{userId !== undefined?'Edit Collaborator':'Create Collaborator'} | PMS</title>
            </Helmet>

            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>
                                {userId !== undefined?'Edit Collaborator':'Add Collaborator'}
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
        </Fragment>
    )
}

export default Create;


