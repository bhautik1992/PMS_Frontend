import { Fragment, useState , useEffect} from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Label,
  Button
} from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import Flatpickr from 'react-flatpickr';
import { PlusSquare } from 'react-feather';
import { Helmet } from 'react-helmet-async';
import * as Yup from 'yup';
import moment from 'moment';
import Sidebar from '@components/sidebar';
import { useRef } from 'react';
import axiosInstance from  '../../helper/axiosInstance';

import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { Editor } from 'react-draft-wysiwyg';

import '@styles/react/libs/flatpickr/flatpickr.scss';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const Index = () => {

  const editorRef = useRef(null);
  const [totalLeaves, setTotalLeaves] = useState(0);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

useEffect(() => {
  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get('/settings');
      if (response?.data?.data?.total_leaves) {
        console.log(response)
        setTotalLeaves(response.data.data.total_leaves);
      }
    } catch (error) {
      console.error('Error fetching settings:', error.message);
    }
  };

  fetchSettings();
}, []);

const calculateLeaveDays = (values) => {
  if (!values.start_date) return 0;

  if (values.day_type === 'half') return 0.5;

  const start = moment(values.start_date, 'DD-MM-YYYY');
  const end = values.end_date ? moment(values.end_date, 'DD-MM-YYYY') : start;

  return end.diff(start, 'days') + 1;
};

  const initialValues = {
    start_date: '',
    end_date: '',
    day_type: 'full',
    day_slot: '',
    description: ''
  };

  const validationSchema = Yup.object({
    start_date: Yup.string().required('Start Date is required'),
    description: Yup.string().required('Description is required')
  });

  return (
    <Fragment>
      <Helmet>
        <title>Leave | PMS</title>
      </Helmet>

      <Col xs={12}>
        <Card>
          <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
            <CardTitle tag="h4">Leaves</CardTitle>
            <Button color="primary" size="sm" onClick={toggleSidebar} outline>
              <PlusSquare size={15} />
            </Button>
          </CardHeader>
        </Card>
      </Col>

      <Sidebar
        size="lg"
        open={sidebarOpen}
        title="Add Leave"
        headerClassName="mb-1 d-flex justify-content-between align-items-center"
        contentClassName="pt-0"
        toggleSidebar={toggleSidebar}
        style={{ width: '35vw', maxWidth: '500px' }}
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { resetForm }) => {
            const formValues = {
              ...values,
              end_date: values.end_date || values.start_date
            };
            // console.log('Form Data:', formValues);
            toggleSidebar();
            resetForm();
            setEditorState(EditorState.createEmpty()); 
          }}
        >
          {({
            values,
            errors,
            touched,
            setFieldValue,
            setFieldTouched,
            setFieldError,
            validateField
          }) => (
            <Form>
              <Row>
                <Col sm="6">
                  <div className="mb-2 pb-50">
                    <h5>Reporting person</h5>
                    <span>Dhruvit</span>
                  </div>
                </Col>

                <Col xs={12}>
                  <Label className="form-label" htmlFor="start_date">
                    Start Date<span className="text-danger">*</span>
                  </Label>
                  <Flatpickr
                    name="start_date"
                    id="start_date"
                    value={values.start_date}
                    className={`form-control ${
                      errors.start_date && touched.start_date ? 'is-invalid' : ''
                    }`}
                    onChange={([date], dateStr) => {
                      setFieldValue('start_date', dateStr);
                      if (values.end_date) {
                        const start = moment(dateStr, 'DD-MM-YYYY');
                        const end = moment(values.end_date, 'DD-MM-YYYY');
                        if (!end.isAfter(start)) setFieldValue('end_date', '');
                      }
                    }}
                    options={{
                      dateFormat: 'd-m-Y',
                      disableMobile: true
                    }}
                  />
                  <ErrorMessage name="start_date" component="div" className="invalid-feedback" />
                </Col>

                <Col xs={12}>
                  <Label className="form-label" htmlFor="end_date">
                    End Date<span className="text-danger">*</span>
                  </Label>
                  <Flatpickr
                    name="end_date"
                    id="end_date"
                    value={values.end_date}
                    className={`form-control ${
                      errors.end_date && touched.end_date ? 'is-invalid' : ''
                    }`}
                    onChange={([date], dateStr) => {
                      const start = moment(values.start_date, 'DD-MM-YYYY');
                      const end = moment(dateStr, 'DD-MM-YYYY');

                      if (start && !end.isAfter(start)) {
                        setFieldValue('end_date', '');
                        setFieldError('end_date', 'End date must be after start date');
                      } else {
                        setFieldValue('end_date', dateStr);

                        if (values.day_type === 'half') {
                          setFieldValue('day_type', 'full');
                          setFieldValue('day_slot', '');
                        }
                      }
                    }}
                    options={{
                      dateFormat: 'd-m-Y',
                      disableMobile: true,
                      minDate: values.start_date
                   ? moment(values.start_date, 'DD-MM-YYYY').toDate() 
                        : null
                    }}
                  />
                  <ErrorMessage name="end_date" component="div" className="invalid-feedback" />
                </Col>

                <Col xs={12} className="mt-2">
                  <Label className="form-label">
                    Leave Type<span className="text-danger">*</span>
                  </Label>
                  <div>
                    <Label className="me-2">
                      <Field type="radio" name="day_type" value="full" /> Full Day
                    </Label>
                    <Label>
                      <Field
                        type="radio"
                        name="day_type"
                        value="half"
                        disabled={!!values.end_date}
                      />{' '}
                      Half Day
                    </Label>
                  </div>    
                </Col>

                {values.day_type === 'half' && (
                  <Col xs={12} className="mt-2">
                    <Field
                      as="select"
                      name="day_slot"
                      className={`form-control ${
                        errors.day_slot && touched.day_slot ? 'is-invalid' : ''
                      }`}
                    >
                      <option value="">-- Select Day Slot --</option>
                      <option value="first-half">First Half</option>
                      <option value="second-half">Second Half</option>
                    </Field>
                    <ErrorMessage name="day_slot" component="div" className="invalid-feedback" />
                  </Col>
                )}

                    <Col sm="12" className="mt-2">
                <Label className="form-label" htmlFor="description">
                    Reason <span className="text-danger">*</span>
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

                        if (data.getCurrentContent().hasText()) {
                        const htmlContent = draftToHtml(convertToRaw(data.getCurrentContent()));
                        setFieldValue('description', htmlContent);
                        setFieldError('description', '');
                        }
                    }}
                    onBlur={() => {
                        setTimeout(() => {
                        setFieldTouched('description', true);
                        validateField('description');
                        }, 300);
                    }}
                    />
                    <ErrorMessage name="description" component="div" className="invalid-feedback d-block" />
                </div>
                </Col>

                <Row className="mt-2">
                <Col sm="6">
                    <div className="mb-2 pb-50">
                    <h5>Total Days</h5>
                    <span>{calculateLeaveDays(values)}</span>
                    </div>
                </Col>

                <Col sm="6">
                    <div className="mb-2 pb-50">
                    <h5>Leave balance</h5>
                    <span>{totalLeaves - calculateLeaveDays(values)}</span>
                    </div>
                </Col>
                </Row>

                <Col xs={12} className="text-center mt-2">
                  <Button type="submit" color="primary" className="me-1">
                    Save
                  </Button>
                  <Button outline type="reset" onClick={toggleSidebar}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          )}
        </Formik>
      </Sidebar>
    </Fragment>
  );
};
export default Index;