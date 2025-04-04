import { Fragment, useState, useEffect } from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardHeader, Label } from 'reactstrap'
import { useSelector } from 'react-redux';
import axiosInstance from  '../../helper/axiosInstance';
import toast from 'react-hot-toast'
import { Copy } from 'react-feather'

const BankDetailsTabContent = () => {
    const { user } = useSelector((state) => state.LoginReducer);
    const [initialValues,setInitialValues] = useState(null);

    const [copied, setCopied]  = useState({
        accnum:false,
        ifsc:false
    });

    // Explicit Function Calling
    useEffect(() => {
        const fetchBankDetails = async () => {
            try {
                const response = await axiosInstance.get('user/bank_details/'+user._id);
                
                if(response.data.success){
                    setInitialValues(response.data.data);
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
        };
    
        fetchBankDetails();
    }, []);

    const handleCopy = (value,type) => {
        navigator.clipboard.writeText(value).then(() => {

            setCopied(prevValue => ({
                ...prevValue,
                [type]:true
            }))

            setTimeout(() => 
                setCopied(prevValue => ({
                    ...prevValue,
                    [type]:false
                })),
            2000);
        }).catch((err) => 
            console.error("Failed to copy:", err)
        );
    };

    return (
        <Fragment>
            <Card>
                <CardHeader className='border-bottom'>
                    <CardTitle tag='h4'>Bank Details</CardTitle>
                </CardHeader>

                <CardBody className='pt-1'>
                    {initialValues &&
                        <Row>
                            <Col sm='6' className='mb-1'>
                                <Label className='form-label'>
                                    Bank Name
                                </Label>
                
                                {initialValues?.bank_id?.name &&
                                    <p className='form-control-static' id='bank_name'>
                                        {initialValues.bank_id.name}
                                    </p>
                                }
                            </Col>

                            <Col sm='6' className='mb-1'>
                                <Label className='form-label'>
                                    Account Number
                                </Label>
                
                                {initialValues?.account_number &&
                                    <p className='form-control-static' id='account_number'>
                                        {initialValues.account_number}

                                        <Copy className="ml-3" onClick={() => handleCopy(initialValues.account_number,'accnum')} style={{height:'15px'}}/>
                                        {copied.accnum && <span className="text-success form-text">Copied!</span>}                                    
                                    </p>
                                }
                            </Col>

                            <Col sm='6' className='mb-1'>
                                <Label className='form-label'>
                                    Branch Name
                                </Label>
                
                                {initialValues?.branch_name &&
                                    <p className='form-control-static' id='branch'>
                                        {initialValues.branch_name}
                                    </p>
                                }
                            </Col>

                            <Col sm='6' className='mb-1'>
                                <Label className='form-label'>
                                    IFSC Code
                                </Label>
                
                                {initialValues?.ifsc_code &&
                                    <p className='form-control-static' id='ifsc_code'>
                                        {initialValues.ifsc_code}

                                        <Copy className="ml-3" onClick={() => handleCopy(initialValues.ifsc_code,'ifsc')} style={{height:'15px'}}/>
                                        {copied.ifsc && <span className="text-success form-text">Copied!</span>}                                    
                                    </p>
                                }
                            </Col>

                            <Col sm='6' className='mb-1'>
                                <Label className='form-label'>
                                    Aadhar Card
                                </Label>
                
                                {initialValues?.aadhar_card &&
                                    <p className='form-control-static' id='aadhar_card'>
                                        {initialValues.aadhar_card}
                                    </p>
                                }
                            </Col>

                            <Col sm='6' className='mb-1'>
                                <Label className='form-label'>
                                    Pan Card
                                </Label>
                
                                {initialValues?.pan_card &&
                                    <p className='form-control-static' id='pan_card'>
                                        {initialValues.pan_card}
                                    </p>
                                }
                            </Col>
                        </Row>
                    }
                </CardBody>
            </Card>
        </Fragment>
    )
}

export default BankDetailsTabContent;


