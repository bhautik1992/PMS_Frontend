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

import axiosInstance from '../../helper/axiosInstance';
import toast from 'react-hot-toast'

const Create = () => {
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
        newcode:'',
        designations,
        allroles,
        allbanks,
        editUserInfo: {},
        editBankInfo: {},
        isSubmit: false
    })    

    const [formData, setFormData] = useState({
        personalInfo: {},
        addressInfo : {},
        companyInfo : {},
        bankInfo    : {},
        userId
    });

    const updateFormData = (step, data) => {
        setFormData(prev => ({ 
            ...prev, 
            [step]: data 
        }));

        if(step === 'bankInfo'){
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
            const endPoint = userId !== undefined?'user/update':'user';
            const response = await axiosInstance.post(endPoint, formData);
            // const response = await axiosInstance.post(import.meta.env.VITE_BACKEND_URL+'user', formData);

            if(response.data.success){
                toast.success(response.data.message);
                navigate('/employee');
            }
        } catch (error) {
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
                    const response = await axiosInstance.get(import.meta.env.VITE_BACKEND_URL+'user/generate/employee_code',{
                        params: { 
                            prefix:settings.emp_code,
                        }
                    });
    
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
                    const response = await axiosInstance.get(import.meta.env.VITE_BACKEND_URL+'user/edit/'+userId);

                    if(response.data.success){
                        setAdditionalInfo(prevVal => ({
                            ...prevVal,
                            newcode:response.data.data.user.employee_code,
                            editUserInfo:response.data.data.user,
                            editBankInfo:response.data.data.bank_detail,
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
            })()
        }
    },[userId])

    const steps = [{
        id: 'personal-info',
        title: 'Personal Info',
        subtitle: 'Add Personal Info',
        content: <PersonalInfo stepper={stepper} additionalInfo={additionalInfo} updateFormData={updateFormData} />
    },{
        id: 'address-info',
        title: 'Address Info',
        subtitle: 'Add Address Info',
        content: <Address stepper={stepper} additionalInfo={additionalInfo} updateFormData={updateFormData} />
    },{
        id: 'company-info',
        title: 'Company Info',
        subtitle: 'Add Company Info',
        content: <CompanyInfo stepper={stepper} additionalInfo={additionalInfo} updateFormData={updateFormData} />
    },{
        id: 'bank-info',
        title: 'Bank Info',
        subtitle: 'Add Bank Info',
        content: <AccountDetails stepper={stepper} additionalInfo={additionalInfo} updateFormData={updateFormData} />
    }]

    return (
        <Fragment>
            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>
                                {userId !== undefined?'Edit Employee':'Add Employee'}
                            </CardTitle>

                            <CardTitle tag='h4'>
                                <Button color='primary' size='sm' onClick={() => navigate(-1)}>
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
        </Fragment>
    )
}

export default Create;


