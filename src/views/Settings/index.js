import { Fragment, useState, useEffect } from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardHeader, Label, Button , ListGroup ,ListGroupItem } from 'reactstrap'
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { useSelector } from 'react-redux';
import axiosInstance from  '../../helper/axiosInstance';
import toast from 'react-hot-toast';
import { useDropzone } from 'react-dropzone'
import { FileText, X, DownloadCloud } from 'react-feather'

import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'

import { Helmet } from 'react-helmet-async';
import InputNumber from 'rc-input-number'
import { Plus, Minus } from 'react-feather'
import '@styles/react/libs/input-number/input-number.scss';
import { useDispatch } from "react-redux";
import { UPDATE_SYSTEM_SETTING } from '../../services/constants'; 

const Index = () => {
    const dispatch = useDispatch();

    const [initialValues, setInitialValues] = useState({
        orignal_code: '',
        emp_code    : '',
        linkedin_url: '',
        twitter_url : '',
        open_days   : 0,
        company_image : null,
        total_leaves: 0,

    });

    // Using an IIFE (Immediately Invoked Function Expression) Inside useEffect
    useEffect(() => {
        (async () => {
            try {
                const response = await axiosInstance.get('settings');
                if(response.data.success){
                    localStorage.setItem('company_image', response.data.data.company_image);
                    setInitialValues(prevValue => ({
                        ...prevValue,
                        ...response.data.data,
                        orignal_code:response.data.data.emp_code,
                        company_image: response.data.data.company_image,
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
    },[])

    const validationSchema = Yup.object({
        emp_code : Yup.string()
            .required()
            .max(6)
            .label('Employee Code'),
        linkedin_url : Yup.string()
            .required()
            .matches(
                /^https:\/\/([\w]+\.)?linkedin\.com\/.+$/,
                "Invalid LinkedIn URL format"
            )
            .max(50)
            .label('Linkedin URL'),
        twitter_url : Yup.string()
            .required()
            .matches(
                /^https:\/\/([\w]+\.)?twitter\.com\/.+$/,
                "Invalid Twitter URL format"
            )
            .max(50)
            .label('Twitter URL'),
            total_leaves: Yup.number()
    .min(0, 'Cannot be negative')
    .max(365, 'Must be under 365')
    .required('Total leaves is required'),
    })

    const [files, setFiles] = useState([])
  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: acceptedFiles => {
      setFiles([...files, ...acceptedFiles.map(file => Object.assign(file))])
    }
  })
  const renderFilePreview = file => {
    if (file.type.startsWith('image')) {
      return <img className='rounded' alt={file.name} src={URL.createObjectURL(file)} height='28' width='28' />
    } else {
      return <FileText size='28' />
    }
  }
  const handleRemoveFile = file => {
    const uploadedFiles = files
    const filtered = uploadedFiles.filter(i => i.name !== file.name)
    setFiles([...filtered])
  } 
  const renderFileSize = size => {
    if (Math.round(size / 100) / 10 > 1000) {
      return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
    } else {
      return `${(Math.round(size / 100) / 10).toFixed(1)} kb`
    }   
  }
  const fileList = files.map((file, index) => (
    <ListGroupItem key={`${file.name}-${index}`} className='d-flex align-items-center justify-content-between'>
      <div className='file-details d-flex align-items-center'>
        <div className='file-preview me-1'>{renderFilePreview(file)}</div>
        <div>
          <p className='file-name mb-0'>{file.name}</p>
          <p className='file-size mb-0'>{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button color='danger' outline size='sm' className='btn-icon' onClick={() => handleRemoveFile(file)}>
        <X size={14} />
      </Button>
    </ListGroupItem>
  ))

    const onSubmit = async (values) => {
        try {
            if(values.orignal_code !== values.emp_code){
                const confirmChange = window.confirm("Changing Employee Code will update all existing employee codes. Do you want to continue?");
                if (!confirmChange) return;
            }
         
    const formData = new FormData();

    // Append text fields
    formData.append('emp_code', values.emp_code);
    formData.append('linkedin_url', values.linkedin_url);
    formData.append('twitter_url', values.twitter_url);
    formData.append('open_days', values.open_days);
    formData.append('total_leaves', values.total_leaves);


  // Append file (if exists)
    if (files.length > 0) {
      formData.append('company_image', files[0]); // assuming single image
    }

            const response = await axiosInstance.post('settings', formData ,  {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
            if(response.data.success){
                toast.success(response.data.message);
                setInitialValues(prevValue => ({
                    ...prevValue,
                    ...response.data.data,
                    orignal_code:response.data.data.emp_code,
                    total_leaves: response.data.data.total_leaves || 0 

                }))

                dispatch({type: UPDATE_SYSTEM_SETTING,data:response.data.data});
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

    return (
        <Fragment>
            <Helmet>
                <title>Settings | PMS</title>
            </Helmet>

            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>Settings</CardTitle>
                        </CardHeader>

                        <CardBody className='pt-1'>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                enableReinitialize={true}
                                onSubmit={onSubmit}
                            >
                                {({ errors, touched  }) => (
                                    <Form>
                                        <Row>
                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='emp_code'>
                                                    Employee Code<span className="required">*</span>
                                                </Label>
                                                <small className='text-muted ms-1'>
                                                    eg. <i>HS</i>
                                                </small>
                                
                                                <Field
                                                    type="text"
                                                    name="emp_code"
                                                    id="emp_code"
                                                    className={`form-control ${errors.emp_code && touched.emp_code ? 'is-invalid' : ''}`}
                                                    maxLength={6}
                                                    autoComplete="off"
                                                    autoFocus
                                                />

                                                <ErrorMessage name="emp_code" component="div" className="invalid-feedback"/>
                                            </Col>

                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='linkedin_url'>
                                                    Linkedin URL<span className="required">*</span>
                                                </Label>
                                
                                                <Field
                                                    type="text"
                                                    name="linkedin_url"
                                                    id="linkedin_url"
                                                    className={`form-control ${errors.linkedin_url && touched.linkedin_url ? 'is-invalid' : ''}`}
                                                    placeholder="https://www.linkedin.com/in/your-profile"
                                                    maxLength={50}
                                                    autoComplete="off"
                                                    />

                                                <ErrorMessage name="linkedin_url" component="div" className="invalid-feedback"/>
                                            </Col>

                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='twitter_url'>
                                                    Twitter URL<span className="required">*</span>
                                                </Label>
                                
                                                <Field
                                                    type="text"
                                                    name="twitter_url"
                                                    id="twitter_url"
                                                    className={`form-control ${errors.twitter_url && touched.twitter_url ? 'is-invalid' : ''}`}
                                                    placeholder="https://twitter.com/your-username"
                                                    maxLength={50}
                                                    autoComplete="off"
                                                />

                                                <ErrorMessage name="twitter_url" component="div" className="invalid-feedback"/>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='open_days'>
                                                    Allow Time Entry
                                                </Label>

                                                <small className='text-muted ms-1'>
                                                    Note: <i>0 means open for all days.</i>
                                                </small>

                                                <Field name="open_days">
                                                    {({ field, form }) => (
                                                        <InputNumber
                                                            id="open_days"
                                                            min={0}
                                                            max={5}
                                                            value={field.value}
                                                            onChange={(value) => form.setFieldValue(field.name, value)}
                                                            onBlur={() => form.setFieldTouched(field.name, true)}
                                                            upHandler={<Plus />}
                                                            downHandler={<Minus />}
                                                        />
                                                    )}
                                                </Field>

                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='total_leaves'>
                                                    Total Leaves (Yearly)
                                                </Label>
                                                <Field name="total_leaves">
                                                    {({ field, form }) => (
                                                        <InputNumber
                                                            id="total_leaves"
                                                            min={0}
                                                            max={365}
                                                            value={field.value}
                                                            onChange={(value) => form.setFieldValue(field.name, value)}
                                                            onBlur={() => form.setFieldTouched(field.name, true)}
                                                            upHandler={<Plus />}
                                                            downHandler={<Minus />}
                                                        />
                                                    )}
                                                </Field>
                                            </Col>

                                            </Col>
                                        </Row>
                                        <Row>
                                        <Col className='mt-1' sm='12'>
                                        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <div className='d-flex align-items-center justify-content-center flex-column'>
            <DownloadCloud size={64} />
            <h5>Drop Files here or click to upload</h5>
            <p className='text-secondary'>
              Drop files here or click{' '}
              <a href='/' onClick={e => e.preventDefault()}>
                browse
              </a>{' '}
              thorough your machine
            </p>
          </div>
        </div>
        {files.length ? (
          <Fragment>
            <ListGroup className='my-2'>{fileList}</ListGroup>
          </Fragment>
        ) : null}
                                        </Col>
                                        </Row>
                                        <Row>
                                            <Col className='mt-1' sm='12'>
                                                <Button type='submit' className='me-1' color='primary'>
                                                    Save
                                                </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                )}
                            </Formik>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default Index;

