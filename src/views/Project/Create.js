import { Fragment, useState, useEffect, useRef } from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardHeader, Label, Button, FormText } from 'reactstrap'
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import axiosInstance from  '../../helper/axiosInstance';
import toast from 'react-hot-toast'
import Flatpickr from 'react-flatpickr'
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import makeAnimated from 'react-select/animated'
import { ChevronsLeft } from 'react-feather'

import { EditorState,convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Editor } from 'react-draft-wysiwyg'
import htmlToDraft from 'html-to-draftjs';

import ReactTagInput from "@pathofdev/react-tag-input";
import "@pathofdev/react-tag-input/build/index.css";

import UploadDocuments from './UploadDocuments';

import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'
import '@styles/react/libs/editor/editor.scss'

const Create = () => {
    const animatedComponents = makeAnimated();
    const navigate           = new useNavigate();
    const { user }           = useSelector((state) => state.LoginReducer);
    const { activeUsers }    = useSelector((state) => state.UsersReducer);
    const { activeClients }  = useSelector((state) => state.ClientsReducer);
    
    const { id: projectId } = useParams();

    const editorRef = useRef(null);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const [reduxLoaded, setReduxLoaded] = useState(false);

    const [componentVal, setComponentVal] = useState({
        userOptions : [],
        clientsOptions : [],
        typeOptions : [
            { value: 'hourly', label: 'Hourly' },
            { value: 'fixed-cost', label: 'Fixed Cost' },
            { value: 'monthly', label: 'Monthly' },
        ],
        statusOptions: [
            { value: 'active', label: 'Active' },
            { value: 'hold', label: 'Hold' },
            { value: 'closed', label: 'Closed' },
        ],
        currencyOpt: [
            { value: 'usd', label: 'USD - $' },
            { value: 'gbp', label: 'GBP - £' },
            { value: 'eur', label: 'EUR - €' },
            { value: 'inr', label: 'INR - ₹' },
        ],
        billingOpt: [
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
        ]
    });

    const [initialValues, setInitialValues] = useState({
        name          : '',
        type          : '',
        price         : '',
        currency      : '',
        billing_cycle : '',
        technology    : [],
        start_date    : '',
        end_date      : '',
        users_id      : [],
        client_id     : '',
        status        : componentVal.statusOptions[0],
        created_by    : user._id,
        description   : '',
    });
    
    const validationSchema = Yup.object({
        name: Yup.string()
            .required()
            .max(50)
            .label('Name'),
        type: Yup.object()
            .required()
            .label('Type'),
        price : Yup.string()
            .required()
            .max(5)
            .label('Price'),
        currency: Yup.object()
            .required()
            .label('Currency'),
        billing_cycle: Yup.object()
            .required()
            .label('Billing Cycle'),
        technology: Yup.array()
            .min(1,'Technology is required field'),
        start_date:Yup.string()
            .required()
            .label('Start Date'),
        users_id: Yup.array()
            .min(1,'At least one user must be selected')
            .label('User'),
        client_id: Yup.object()
            .required()
            .label('Client'),
        status: Yup.object()
            .required()
            .label('Status'),
    })

    useEffect(() => {
        setTimeout(() => {
            const editorDiv = editorRef.current?.querySelector(".rdw-editor-main");
                            
            if (editorDiv) {
                editorDiv.style.overflowY = "auto";
                editorDiv.addEventListener("wheel", (event) => {
                    const { scrollTop, scrollHeight, clientHeight } = editorDiv;
                    
                    const isScrollingUp = event.deltaY < 0;
                    const isScrollingDown = event.deltaY > 0;
                    
                    const atTop = scrollTop === 0;
                    const atBottom = scrollTop + clientHeight >= scrollHeight;
                
                    if ((isScrollingUp && atTop) || (isScrollingDown && atBottom)) {
                        event.stopPropagation(); // Prevent parent container scroll
                    } else {
                        event.stopImmediatePropagation(); // Allow normal scrolling inside editor
                    }
                });
            }
        }, 100); // Wait to ensure DOM is available
        
    
        return () => {
            if (editorRef.current) {
                const editorDiv = editorRef.current.querySelector(".rdw-editor-main");
                if (editorDiv) {
                    editorDiv.removeEventListener("wheel", () => {});
                }
            }
        };
    }, []);

    useEffect(() => {
        const temp = (
            activeUsers.length > 0 &&
            activeClients.length > 0
        )

        if(temp){
            setReduxLoaded(true);
        }
    },[activeUsers, activeClients])

    useEffect(() => {
        if(reduxLoaded){
            let options1 = activeUsers.map((val,key) => ({
                label: val.first_name+' '+val.last_name,    
                value: val._id, 
            }))
    
            setComponentVal(prevVal => ({
                ...prevVal,
                userOptions:options1
            }))

            let options2 = activeClients.map((val,key) => ({
                label: val.first_name,    
                value: val._id, 
            }))
    
            setComponentVal(prevVal => ({
                ...prevVal,
                clientsOptions:options2
            }))
        }
    },[reduxLoaded])
    
    const onSubmit = async (values) => {
        try {
            const formattedValues = {
                ...values,
                description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            };

            const endPoint = (projectId !== undefined)?'projects/update':'projects/create';
            const response = await axiosInstance.post(endPoint, formattedValues);

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

    useEffect(() => {
        if(projectId !== undefined && reduxLoaded){
            ( async () => {
                try{
                    const response = await axiosInstance.get('projects/edit/'+projectId);

                    if(response.data.success){
                        const { type, currency, billing_cycle, status, users_id, client_id, ...restData } = response.data.data;
                        const getOption = (options, value) => options.find(opt => opt.value === value) || '';

                        if (response.data.data.description) {
                            const blocksFromHtml = htmlToDraft(response.data.data.description);
                            const { contentBlocks, entityMap } = blocksFromHtml;
                            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                            const editorState = EditorState.createWithContent(contentState);
    
                            setEditorState(editorState);
                        }

                        const getOptions = (options, values) => {
                            if (!Array.isArray(values)) return [];
                            return options.filter(opt => values.includes(opt.value));
                        }

                        setInitialValues(prevVal => ({
                            ...prevVal,
                            ...restData,
                            type         : getOption(componentVal.typeOptions, type),
                            currency     : getOption(componentVal.currencyOpt, currency),
                            billing_cycle: getOption(componentVal.billingOpt, billing_cycle),
                            users_id     : getOptions(componentVal.userOptions, users_id),
                            client_id    : getOption(componentVal.clientsOptions, client_id),
                            status       : getOption(componentVal.statusOptions, status),
                        }));
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
    },[projectId,componentVal.userOptions])

    const handleNumericInput = (event, setFieldValue) => {
        const { name, value } = event.target;
        const numericValue = value.replace(/[^0-9]/g, "");
        setFieldValue(name, numericValue);
    }

    return (
        <Fragment>
            <Row>
                <Col xs={12}>
                    <Card>
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            enableReinitialize={true}
                            onSubmit={onSubmit}
                        >
                            {({ errors, touched, setFieldValue, setTouched, setFieldError, setFieldTouched, validateField, values }) => (
                                <Form>
                                <CardHeader className='border-bottom'>
                                    <CardTitle tag='h4'>
                                        {projectId !== undefined?'Edit Project':'Add Project'}
                                    </CardTitle>

                                    <CardTitle tag='h4'>
                                        <Button type='submit' size='sm' className='me-1' color='primary'>
                                            {projectId !== undefined?'Update':'Save'}
                                        </Button>

                                        <Button color='secondary' size='sm' onClick={() => navigate(-1)}>
                                            <ChevronsLeft size={13} />
                                        </Button>
                                    </CardTitle>
                                </CardHeader>

                                <CardBody className='pt-1'>
                                    <Row>
                                        <Col md='4'>
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

                                        <Col md='4'>
                                            <Label className='form-label' for='user'>
                                                Type<span className="required">*</span>
                                            </Label>

                                            <Select
                                                name="type"
                                                id="type"
                                                theme={selectThemeColors}
                                                className={`react-select ${(errors.type && touched.type) && 'is-invalid'}`}
                                                value={values.type}
                                                classNamePrefix='select'
                                                options={componentVal.typeOptions}
                                                onChange={(option) => setFieldValue("type", option)}
                                                onBlur={() => setFieldTouched("type", true)}
                                                isClearable={false}
                                            />

                                            <ErrorMessage name="type" component="div" className="invalid-feedback"/>
                                        </Col>

                                        <Col md='4'>
                                            <Label className='form-label' for='price'>
                                                Price/Rate<span className="required">*</span>
                                            </Label>
                            
                                            <Field
                                                type="text"
                                                name="price"
                                                id="price"
                                                className={`form-control ${errors.price && touched.price ? 'is-invalid' : ''}`}
                                                onChange={(event) => handleNumericInput(event, setFieldValue)}
                                                maxLength={5}
                                                autoComplete="off"
                                            />

                                            <ErrorMessage name="price" component="div" className="invalid-feedback"/>
                                        </Col>
                                    </Row>

                                    <Row className='mt-1'>
                                        <Col md='4'>
                                            <Label className='form-label' for='currency'>
                                                Currency<span className="required">*</span>
                                            </Label>

                                            <Select
                                                name="currency"
                                                id="currency"
                                                theme={selectThemeColors}
                                                className={`react-select ${(errors.currency && touched.currency) && 'is-invalid'}`}
                                                classNamePrefix='select'
                                                value={values.currency}
                                                options={componentVal.currencyOpt}
                                                onChange={(option) => setFieldValue("currency", option)}
                                                onBlur={() => setFieldTouched("currency", true)}
                                                isClearable={false}
                                            />

                                            <ErrorMessage name="currency" component="div" className="invalid-feedback"/>
                                        </Col>

                                        <Col md='4'>
                                            <Label className='form-label' for='billing_cycle'>
                                                Billing Cycle<span className="required">*</span>
                                            </Label>

                                            <Select
                                                name="billing_cycle"
                                                id="billing_cycle"
                                                theme={selectThemeColors}
                                                className={`react-select ${(errors.billing_cycle && touched.billing_cycle) && 'is-invalid'}`}
                                                classNamePrefix='select'
                                                value={values.billing_cycle}
                                                options={componentVal.billingOpt}
                                                onChange={(option) => setFieldValue("billing_cycle", option)}
                                                onBlur={() => setFieldTouched("billing_cycle", true)}
                                                isClearable={false}
                                            />

                                            <ErrorMessage name="billing_cycle" component="div" className="invalid-feedback"/>
                                        </Col>

                                        <Col md='4'>
                                            <Label className='form-label' for='technology'>
                                                Technology<span className="required">*</span>
                                            </Label>
                                            
                                            <div 
                                                className={`tag-wrapper ${errors.technology && touched.technology ? 'is-invalid' : ''}`}
                                                onBlur={() => setFieldTouched('technology', true)}
                                            >
                                                <ReactTagInput
                                                    tags={values.technology}
                                                    placeholder="Press enter to add tag"
                                                    onChange={(newTags) => setFieldValue("technology", newTags)}
                                                    onBlur={() => setFieldTouched('technology', true)}
                                                />
                                            </div>

                                            {touched.technology && errors.technology && (
                                                <div className="invalid-feedback d-block">{errors.technology}</div>
                                            )}
                                        </Col>
                                    </Row>
                                    
                                    <Row className='mt-1'>
                                        <Col md='4'>
                                            <Label className='form-label' for='start_date'>
                                                Start Date<span className="required">*</span>
                                            </Label>
                                            
                                            <Flatpickr
                                                name="start_date"
                                                id="start_date"
                                                value={values.start_date}
                                                className={`form-control ${errors.start_date && touched.start_date ? 'is-invalid rm-op' : ''}`}
                                                onChange={([date], dateStr) => {
                                                    setFieldValue("start_date", dateStr);
                                                    setFieldTouched("start_date", true, true);
                                                    setFieldError("start_date", "");

                                                    // Clear end_date if it's not greater than new start_date
                                                    if (values.end_date) {
                                                        const endDateObj = new Date(values.end_date);
                                                        const startDateObj = new Date(dateStr);
                                                        
                                                        if (endDateObj <= startDateObj) {
                                                            setFieldValue("end_date", "");
                                                        }
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    const instance = e.target._flatpickr;
                                                    
                                                    setTimeout(() => {
                                                        if (!instance.isOpen) {
                                                            setFieldTouched("start_date", true, true);
                                                        }
                                                    }, 100);
                                                }}
                                                options={{
                                                    dateFormat: 'Y-m-d',
                                                    allowInput: false,
                                                    clickOpens: true,
                                                    disableMobile: true,
                                                }}
                                            />

                                            <ErrorMessage name="start_date" component="div" className="invalid-feedback"/>
                                        </Col>

                                        <Col md='4'>
                                            <Label className='form-label' for='end_date'>
                                                End Date
                                            </Label>

                                            <Flatpickr
                                                name="end_date"
                                                id="end_date"
                                                value={values.end_date}
                                                className={`form-control ${errors.end_date && touched.end_date ? 'is-invalid rm-op' : ''}`}
                                                onChange={([date], dateStr) => {
                                                    const startDate = values.start_date ? new Date(values.start_date) : null;
                                                    const endDate = new Date(dateStr);

                                                    if (startDate && endDate <= startDate) {
                                                        setFieldValue("end_date", "");
                                                        setFieldError("end_date", "End date must be greater than start date");
                                                    } else {
                                                        setFieldValue("end_date", dateStr);
                                                        setFieldTouched("end_date", true, true);
                                                        setFieldError("end_date", "");
                                                    }
                                                }}
                                                onBlur={(e) => {
                                                    const instance = e.target._flatpickr;
                                                
                                                    setTimeout(() => {
                                                        if (!instance.isOpen) {
                                                        setFieldTouched("end_date", true, true);
                                                        }
                                                    }, 100);
                                                }}
                                                options={{
                                                    dateFormat: 'Y-m-d',
                                                    allowInput: false,
                                                    clickOpens: true,
                                                    disableMobile: true,
                                                    minDate: values.start_date ? new Date(new Date(values.start_date).getTime() + 86400000) : null
                                                }}
                                            />
                                        </Col>

                                        <Col md='4'>
                                            <Label className='form-label' for='users_id'>
                                                Select User<span className="required">*</span>
                                            </Label>

                                            <Select
                                                name="users_id"
                                                id="users_id"
                                                theme={selectThemeColors}
                                                className={`react-select ${(errors.users_id && touched.users_id) && 'is-invalid'}`}
                                                classNamePrefix='select'
                                                value={values.users_id}
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
                                    </Row>
                                    
                                    <Row className='mt-1'>
                                        <Col md='4'>
                                            <Label className='form-label' for='client_id'>
                                                Client<span className="required">*</span>
                                            </Label>

                                            <Select
                                                name="client_id"
                                                id="client_id"
                                                theme={selectThemeColors}
                                                className={`react-select ${(errors.client_id && touched.client_id) && 'is-invalid'}`}
                                                classNamePrefix='select'
                                                value={values.client_id}
                                                options={componentVal.clientsOptions}
                                                onChange={(option) => setFieldValue("client_id", option)}
                                                onBlur={() => setFieldTouched("client_id", true)}
                                                isClearable={false}
                                            />

                                            <ErrorMessage name="client_id" component="div" className="invalid-feedback"/>
                                        </Col>

                                        <Col md='4'>
                                            <Label className='form-label' for='user'>
                                                Status<span className="required">*</span>
                                            </Label>

                                            <Select
                                                name="status"
                                                id="status"
                                                theme={selectThemeColors}
                                                className={`react-select ${(errors.status && touched.status) && 'is-invalid'}`}
                                                classNamePrefix='select'
                                                value={values.status}
                                                options={componentVal.statusOptions}
                                                defaultValue={componentVal.statusOptions[0]}
                                                onChange={(option) => setFieldValue("status", option)}
                                                onBlur={() => setFieldTouched("status", true)}
                                                isClearable={false}
                                            />

                                            <ErrorMessage name="status" component="div" className="invalid-feedback"/>
                                        </Col>
                                    </Row>
                                    
                                    <Row className='mt-1'>
                                        <Col md='6'>
                                            <Label className='form-label' for='document'>
                                                Upload Documents
                                            </Label>   

                                            <div className="doc_border">
                                                <UploadDocuments />
                                            </div>
                                        </Col>

                                        <Col md='6'>
                                            <Label className='form-label' for='description'>
                                                Description
                                            </Label>
                                            
                                            <div ref={editorRef} className="editor-wrapper">
                                                <Editor
                                                    editorClassName="editor-content"
                                                    wrapperClassName="editor-container"
                                                    editorState={editorState}
                                                    onEditorStateChange={(data) => {
                                                        setEditorState(data);
                                                    }}
                                                />
                                            </div>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col className='mt-1' sm='12'>
                                            <Button type='submit' className='me-1' color='primary'>
                                                {projectId !== undefined?'Update':'Save'}
                                            </Button>

                                            <Button type='button' className='me-1' color='secondary' onClick={() => navigate(-1)}>
                                                Cancel
                                            </Button>
                                        </Col>
                                    </Row>    
                                </CardBody>
                                </Form>
                            )}
                        </Formik>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default Create;