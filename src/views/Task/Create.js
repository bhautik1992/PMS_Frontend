import { Fragment, useState, useEffect, useRef } from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardHeader, Label, Button, FormText } from 'reactstrap'
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import toast from 'react-hot-toast'
import Flatpickr from 'react-flatpickr'
import { useNavigate } from 'react-router-dom';
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { useParams } from 'react-router-dom';
import axiosInstance from  '../../helper/axiosInstance';

import { EditorState,convertToRaw, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Editor } from 'react-draft-wysiwyg'
import htmlToDraft from 'html-to-draftjs';

import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/pages/page-account-settings.scss'
import '@styles/react/libs/editor/editor.scss'

import { getProjects } from '../../services/actions/ProjectsAction';
import { ChevronsLeft } from 'react-feather'

import moment from 'moment';

const Create = () => {
    const validationSchema = Yup.object({
        project: Yup.object()
            .required()
            .label('Project'),
        user: Yup.object()
            .required()
            .label('User'),
        hours: Yup.string()
            .required()
            .max(3)
            .label('Hours'),
        start_end_date: Yup.array()
            .test("required", "Start and End date is required", (value) => value && value.length > 0)
            .min(2, "Please select both start and end dates"),
        name: Yup.string()
            .required()
            .max(200)
            .label('Name'),
    })

    const dispatch     = new useDispatch();
    const navigate     = new useNavigate();
    const flatpickrRef = useRef(null);
    const editorRef    = useRef(null);
    const { id: taskId } = useParams();

    const { user }           = useSelector((state) => state.LoginReducer);
    const { activeProjects } = useSelector((state) => state.ProjectsReducer);
    const { activeUsers }    = useSelector((state) => state.UsersReducer);
        
    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    
    const [initialValues, setInitialValues] = useState({
        project       : '',
        user          : '',
        hours         : '',
        start_end_date: [],
        name          : '',
        description   : '', 
        created_by    : '',
    });
    
    const [componentVal, setComponentVal] = useState({
        projectsOptions: [],
        userOptions    : [],
    });

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
        if(user?._id){
            dispatch(getProjects(user._id))

            setInitialValues(prevVal => ({
                ...prevVal,
                created_by: user._id
            }))
        }
    },[user]);

    useEffect(() => {
        if(activeProjects.length > 0){
            const options = activeProjects.map((val,key) => ({
                label: val.name,    
                value: val._id, 
            })) 
    
            setComponentVal(prevVal => ({
                ...prevVal,
                projectsOptions:options
            }))
        }
    },[activeProjects])

    useEffect(() => {
        if(activeUsers.length > 0){
            const options = activeUsers.map((val,key) => ({
                label: val.first_name+' '+val.last_name,    
                value: val._id, 
            })) 
    
            setComponentVal(prevVal => ({
                ...prevVal,
                userOptions:options
            }))
        }
    },[activeUsers])

    const handleNumericInput = (event, setFieldValue) => {
        const { name, value } = event.target;
        const numericValue = value.replace(/[^0-9]/g, "");
        setFieldValue(name, numericValue);
    }

    const onSubmit = async (values) => {
        try {
            const formattedValues = {
                ...values,
                description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
            };
            
            const endPoint = taskId !== undefined?'tasks/update':'tasks/create';
            const response = await axiosInstance.post(endPoint, formattedValues);

            if(response.data.success){
                toast.success(response.data.message);
                navigate('/tasks');
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
        if(taskId !== undefined && componentVal.projectsOptions.length > 0 && componentVal.userOptions.length > 0){
            ( async () => {
                try {
                    const response = await axiosInstance.get('tasks/edit/'+taskId);

                    if(response.data.success){
                        const selectedProject = componentVal.projectsOptions.find(
                            option => option.value === response.data.data.project_id._id
                        ) || null;

                        const selectedUser = componentVal.userOptions.find(
                            option => option.value === response.data.data.user_id
                        ) || null;
                        
                        const startDate = response.data.data.ymd_start_date;
                        const endDate   = response.data.data.ymd_end_date;

                        if (response.data.data.description) {
                            const blocksFromHtml = htmlToDraft(response.data.data.description);
                            const { contentBlocks, entityMap } = blocksFromHtml;
                            const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
                            const editorState = EditorState.createWithContent(contentState);
    
                            setEditorState(editorState);
                        }

                        setInitialValues(prevVal => ({
                            ...prevVal,
                            ...response.data.data,
                            project: selectedProject,
                            user: selectedUser,
                            start_end_date: [startDate, endDate],
                        }))

                        if(flatpickrRef.current){
                            flatpickrRef.current.flatpickr.setDate([startDate, endDate]);
                            flatpickrRef.current.flatpickr.set('minDate', moment(response.data.data.project_id.start_date).format("YYYY-MM-DD"));
                            flatpickrRef.current.flatpickr.set('maxDate', moment(response.data.data.project_id.end_date).format("YYYY-MM-DD"));
                        }
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
    },[taskId,componentVal])

    const handleTaskDates = async (name, option, setFieldValue) => {
        setFieldValue(name,option)

        try {
            const response = await axiosInstance.get('projects/duration/'+option.value);

            if(response.data.success){
                const { start_date, end_date } = response.data.data;
                let minusOneStateDate = moment(start_date).subtract(1, "days").format("YYYY-MM-DD");
                let modifiedEndDate =  end_date?moment(end_date).format("YYYY-MM-DD"):null;

                setFieldValue("start_end_date", []);
                if (flatpickrRef.current) {
                    flatpickrRef.current.flatpickr.setDate([]);

                    flatpickrRef.current.flatpickr.set('minDate', minusOneStateDate);
                    flatpickrRef.current.flatpickr.set('maxDate', modifiedEndDate);

                    flatpickrRef.current.flatpickr.set('disable', [
                        function (date) {
                            return modifiedEndDate
                                ? date < new Date(minusOneStateDate) || date > new Date(modifiedEndDate)
                                : date < new Date(minusOneStateDate);
                        }
                    ]);
                }
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
    }

    return (
        <Fragment>
            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className='border-bottom'>
                            <CardTitle tag='h4'>
                                {taskId !== undefined?'Edit Task':'Add Task'}
                            </CardTitle>

                            <CardTitle tag='h4'>
                                <Button color='secondary' size='sm' onClick={() => navigate(-1)}>
                                    <ChevronsLeft size={15} />
                                </Button>
                            </CardTitle>
                        </CardHeader>

                        <CardBody className='pt-1'>
                            <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                enableReinitialize={true}
                                onSubmit={onSubmit}
                            >
                                {({ errors, touched, setFieldValue, setTouched, setFieldError, setFieldTouched, validateField, values }) => (
                                    <Form>
                                        <Row>
                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='project'>
                                                    Select Project<span className="required">*</span>
                                                </Label>
                                                
                                                <Select
                                                    name="project"
                                                    id="project"
                                                    theme={selectThemeColors}
                                                    className={`react-select ${(errors.project && touched.project) && 'is-invalid'}`}
                                                    classNamePrefix='select'
                                                    options={componentVal.projectsOptions}
                                                    value={values.project}
                                                    onChange={(option) => handleTaskDates("project", option, setFieldValue)}
                                                    onBlur={() => setFieldTouched("project", true)}
                                                    isClearable={false}
                                                    autoFocus
                                                />

                                                {errors.project && touched.project && (
                                                    <div className="invalid-feedback d-block">{errors.project}</div>
                                                )}
                                            </Col>

                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='user'>
                                                    Select User<span className="required">*</span>
                                                </Label>

                                                <Select
                                                    name="user"
                                                    id="user"
                                                    theme={selectThemeColors}
                                                    className={`react-select ${(errors.user && touched.user) && 'is-invalid'}`}
                                                    classNamePrefix='select'
                                                    options={componentVal.userOptions}
                                                    value={values.user}
                                                    onChange={(option) => setFieldValue("user", option)}
                                                    onBlur={() => setFieldTouched("user", true)}
                                                    isClearable={false}
                                                />

                                                {errors.user && touched.user && (
                                                    <div className="invalid-feedback d-block">{errors.user}</div>
                                                )}
                                            </Col>

                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='hours'>
                                                    Estimated Hours<span className="required">*</span>
                                                </Label>

                                                <Field
                                                    type="text"
                                                    name="hours"
                                                    id="hours"
                                                    className={`form-control ${errors.hours && touched.hours ? 'is-invalid' : ''}`}
                                                    maxLength={3}
                                                    onChange={(event) => handleNumericInput(event, setFieldValue)}
                                                    autoComplete="off"
                                                />

                                                <ErrorMessage name="hours" component="div" className="invalid-feedback"/>
                                            </Col>
                                            

                                            <Col sm='4' className='mb-1'>
                                                <Label className='form-label' for='start_date'>
                                                    Start Date / End Date<span className="required">*</span>
                                                </Label>
                                
                                                <Flatpickr
                                                    ref={flatpickrRef}
                                                    name="start_end_date"
                                                    id="start_end_date"
                                                    className={`form-control ${errors.start_end_date && touched.start_end_date ? 'is-invalid rm-op' : ''}`}
                                                    value={values.start_end_date}
                                                    onChange={(dates, dateStr, instance) => {
                                                        // if (dates.length === 2 && (dates[0].toDateString() === dates[1].toDateString())) {
                                                        //     instance.clear();
                                                        //     return;
                                                        // }

                                                        const formattedDates = dates.map(date => instance.formatDate(date, "Y-m-d"));
                                                        setFieldValue("start_end_date", formattedDates);
                                                        setFieldError("start_end_date", "");
                                                    }}
                                                    onBlur={() => {
                                                        setTimeout(() => {
                                                            setFieldTouched("start_end_date", true);
                                                            validateField("start_end_date");
                                                        },300)
                                                    }}
                                                    options={{
                                                        mode : 'range',
                                                        dateFormat: 'Y-m-d',
                                                        allowInput: false,
                                                        clickOpens: true,
                                                        disableMobile: true,
                                                    }}
                                                />
                                                <ErrorMessage name="start_end_date" component="div" className="invalid-feedback"/>
                                            </Col>

                                            <Col sm='8' className='mb-1'>
                                                <Label className='form-label' for='name'>
                                                    Name<span className="required">*</span>
                                                </Label>
                                
                                                <Field
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                                                    maxLength={200}
                                                    autoComplete="off"
                                                />

                                                <ErrorMessage name="name" component="div" className="invalid-feedback"/>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col sm='12' className='mb-1'>
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
                                                    {taskId !== undefined?'Update':'Save'}
                                                </Button>
                                            
                                                <Button type='button' className='me-1' color='secondary' onClick={() => navigate(-1)}>
                                                    Cancel
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

export default Create;


