import { useState, useEffect, useRef } from 'react'
import Sidebar from '@components/sidebar'
import { Row, Col, Button, Label, } from 'reactstrap'
import Flatpickr from 'react-flatpickr'
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';

import { EditorState,convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { Editor } from 'react-draft-wysiwyg'

import axiosInstance from  '../../helper/axiosInstance';
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux';

import '@styles/react/libs/flatpickr/flatpickr.scss';
import '../../../src/assets/css/modal.css';
import '@styles/react/libs/editor/editor.scss';

const TimeEntry = ({ open, toggleSidebar, row }) => {
    const validationSchema = Yup.object({
        date: Yup.string()
            .required()
            .label('Date'),
        hours: Yup.string()
            .required()
            .label('Hours'),
        description: Yup.string()
            .required()
            .label('Description'),
    })

    const editorRef = useRef(null);
    const { user }  = useSelector((state) => state.LoginReducer);
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    const [initialValues, setInitialValues] = useState({
        project_id : row.project_id,
        task_id    : row._id,
        user_id    : user._id,
        date       : '',
        hours      : '',
        description: '',
    });

    useEffect(() => {
        if (open) {
            setEditorState(EditorState.createEmpty());

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
        }
    
        return () => {
            if (editorRef.current) {
                const editorDiv = editorRef.current.querySelector(".rdw-editor-main");
                if (editorDiv) {
                    editorDiv.removeEventListener("wheel", () => {});
                }
            }
        };
    }, [open]);

    const onSubmit = async (values, { resetForm }) => {
        try {
            const response = await axiosInstance.post(import.meta.env.VITE_BACKEND_URL+'time_entry/create', values);

            if(response.data.success){
                toast.success(response.data.message);
                resetForm();
                toggleSidebar();
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
        <Sidebar
            size='lg'
            open={open}
            title={row.project_name}
            headerClassName='mb-1'
            contentClassName='pt-0'
            toggleSidebar={toggleSidebar}
            style={{ 
                width: "35vw", 
                maxWidth: "500px" 
            }}
        >
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize={true}
                onSubmit={onSubmit}
            >
            {({ errors, touched, setFieldValue, setTouched, setFieldError, setFieldTouched, validateField, values }) => (
                <Form>
                    <Row>
                        <Col sm='6'>
                            <div className='mb-2 pb-50'>
                                <h5>Task Name</h5>
                                <span>{row.name}</span>
                            </div>
                        </Col>

                        <Col sm='6'>
                            <div className='mb-2 pb-50'>
                                <h5>Estimated Hours</h5>
                                <span>{row.hours}</span>
                            </div>
                        </Col>

                        <Col sm='6'>
                            <div className='mb-2 pb-50'>
                                <h5>Start Date</h5>
                                <span>{row.start_date}</span>
                            </div>
                        </Col>
                        
                        <Col sm='6'>
                            <div className='mb-2 pb-50'>
                                <h5>End Date</h5>
                                <span>{row.end_date}</span>
                            </div>
                        </Col>

                        <Col sm='6' className='mb-1'>
                            <Label className='form-label' for='start_date'>
                                Select Date <span className="required">*</span>
                            </Label>

                            <Flatpickr
                                name="date"
                                id="date"
                                className={`form-control ${errors.date && touched.date ? 'is-invalid rm-op' : ''}`}
                                onChange={(dates, dateStr, instance) => {
                                    setFieldValue("date", dateStr);
                                    setFieldError("date", "");
                                }}
                                onBlur={(e) => {
                                    setTimeout(() => {
                                        const flatpickrInstance = e.target._flatpickr;
                                        
                                        // Prevent validation if the user clicked a disabled date
                                        if (flatpickrInstance.isOpen) return;

                                        // Check if the field is empty
                                        if (!flatpickrInstance.selectedDates.length) {
                                            setFieldTouched("date", true);
                                            setFieldError("date", "Date is required");
                                        }
                                    }, 300);
                                }}
                                onReady={(selectedDates, dateStr, instance) => {
                                    // Prevent clicking on disabled dates from closing the calendar
                                    instance.calendarContainer.addEventListener("click", (event) => {
                                        if (event.target.classList.contains("flatpickr-disabled")) {
                                            event.stopPropagation();
                                            event.preventDefault();
                                        }
                                    });
                                }}
                                options={{
                                    dateFormat: 'Y-m-d',
                                    allowInput: false,
                                    clickOpens: true,
                                    disableMobile: true,
                                    enable: [{ from: row.ymd_start_date, to: row.ymd_end_date }],
                                }}
                                // autoFocus
                            />                   

                            <ErrorMessage name="date" component="div" className="invalid-feedback"/>
                        </Col>

                        <Col sm='6' className='mb-1'>
                            <Label className='form-label' for='hours'>
                                Hours <span className="required">*</span>
                            </Label>

                            <Flatpickr
                                name="hours"
                                id="hours"
                                className={`form-control ${errors.hours && touched.hours ? 'is-invalid rm-op' : ''}`}
                                onChange={(dates, dateStr, instance) => {
                                    setFieldValue("hours", dateStr);
                                    setFieldError("hours", "");
                                }}
                                onBlur={() => {
                                    setTimeout(() => {
                                        setFieldTouched("hours", true);
                                        validateField("hours");
                                    },300)
                                }}
                                options={{
                                    enableTime: true,
                                    noCalendar: true,
                                    dateFormat: 'H:i',
                                    time_24hr: true,
                                    minuteIncrement: 15,
                                    onOpen: (selectedDates, dateStr, instance) => {
                                        if (!values.hours) {
                                            const defaultTime = "02:00";
                                            instance.setDate(defaultTime, false);
                                            setFieldValue("hours", defaultTime);
                                            setFieldError("hours", "");
                                        }
                                    }
                                }}
                            />

                            <ErrorMessage name="hours" component="div" className="invalid-feedback"/>
                        </Col>

                        <Col sm='12' className='mb-1'>
                            <Label className='form-label' for='description'>
                                Description <span className="required">*</span>
                            </Label>

                            <div ref={editorRef} className="editor-wrapper">
                                <Editor
                                    name="description"
                                    id="description"
                                    editorState={editorState}
                                    editorClassName="editor-content"
                                    wrapperClassName={`editor-container ${errors.description && touched.description ? 'editor-error-border' : ''}`}
                                    onEditorStateChange={(data) => {
                                        setEditorState(data);

                                        if(data.getCurrentContent().hasText()) {
                                            const htmlContent = draftToHtml(convertToRaw(editorState.getCurrentContent()))

                                            setFieldValue("description", htmlContent);
                                            setFieldError("description", "");
                                        }
                                    }}
                                    onBlur={() => {
                                        setTimeout(() => {
                                            setFieldTouched("description", true);
                                            validateField("description");
                                        },300)
                                    }}
                                />

                                <ErrorMessage name="description" component="div" className="invalid-feedback d-block"/>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col className='mt-1' sm='12'>
                            <Button type='submit' className='me-1' color='primary'>
                                Save
                            </Button>
                            
                            <Button type='reset' color='secondary' outline onClick={toggleSidebar}>
                                Cancel
                            </Button>
                        </Col>
                    </Row>
                </Form>
            )}
            </Formik>
        </Sidebar>
    )
}

export default TimeEntry;


