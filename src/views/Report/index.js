import { Fragment, useState, useEffect, useRef } from 'react';
import { Row, Col, Card, CardBody, CardTitle, CardHeader, Label, Button } from 'reactstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import axiosInstance from '../../helper/axiosInstance';
import Flatpickr from 'react-flatpickr';
import 'flatpickr/dist/themes/material_blue.css';
import monthSelectPlugin from 'flatpickr/dist/plugins/monthSelect';
import 'flatpickr/dist/plugins/monthSelect/style.css';
import { reportColumn } from '../Table/Columns';
import DataTableComponent from '../Table/DataTableComponent';
import { Helmet } from 'react-helmet-async';
import '@styles/react/libs/flatpickr/flatpickr.scss';
import * as Yup from 'yup';
import { Download } from 'react-feather';
import Spinner from '../../@core/components/spinner/Loading-spinner';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

const Index = () => {
  const currentDate = new Date();
  const defaultMonth = `${currentDate.getMonth() + 1}-${currentDate.getFullYear()}`;

  const [initialValues, setInitialValues] = useState({
    user: '',
    project: '',
    date: defaultMonth
  });

  const validationSchema = Yup.object().shape({
    user: Yup.string().required('User is required'),
  });

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [usersAllTask, setUsersAllTask] = useState([]);
  const [flattenedTaskData, setFlattenedTaskData] = useState([]);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState('');
  const [submittedValues, setSubmittedValues] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState('');

  const reportRef = useRef(null);

  // Fetch users on mount
  useEffect(() => {
    axiosInstance.get('user')
      .then(res => setUsers(res.data.data))
      .catch(err => console.error('Failed to fetch Users:', err));
  }, []);

  // Fetch projects when selectedUser changes
  useEffect(() => {
    if (!selectedUser) return;
    axiosInstance.get(`/projects/${selectedUser}`)
      .then(res => setProjects(res.data.data))
      .catch(err => console.error('Failed to fetch Projects:', err));
  }, [selectedUser]);

  // Fetch task entries on form submission
  useEffect(() => {
    if (!submittedValues) return;
    setLoading(true);
    axiosInstance.post('task_time_entry', submittedValues)
      .then(res => {
        const taskData = res.data.data;
        setUsersAllTask(taskData);
        if (taskData.entries?.length) {
          setUserName(taskData.entries[0].user?.first_name || '');
        }
        setFormSubmitted(true);
      })
      .catch(err => console.error('Failed to fetch task time entry:', err))
      .finally(() => setLoading(false));
  }, [submittedValues]);

  // Flatten and pivot data
  useEffect(() => {
    if (!usersAllTask?.entries?.length) return;

    const flatData = usersAllTask.entries.map(({ project, task, date, hours }) => ({
      project: project.name,
      task: task.name,
      date: new Date(date),
      hours
    }));

    const selectedDate = new Date(usersAllTask.entries[0].date);
    const daysInMonth = getDaysInMonth(selectedDate);
    const pivot = {};

    for (const entry of flatData) {
      const key = `${entry.project}||${entry.task}`;
      const day = entry.date.getUTCDate();

      if (!pivot[key]) {
        pivot[key] = {
          project: entry.project,
          task: entry.task,
          total: 0
        };
        for (let i = 1; i <= daysInMonth; i++) {
          pivot[key][`day_${i}`] = 0;
        }
      }

      pivot[key][`day_${day}`] += entry.hours;
      pivot[key].total += entry.hours;
    }

    const finalTableData = Object.values(pivot);
    setFlattenedTaskData(finalTableData);
  }, [usersAllTask]);

  // Helper to load base64 image
  const getBase64FromUrl = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = url;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = reject;
    });
  };

  // PDF download
  const downloadPDF = async () => {
    if (!flattenedTaskData.length) return;

    const selectedDate = new Date(usersAllTask.entries[0].date);
    const daysInMonth = getDaysInMonth(selectedDate);
    const logoUrl = `http://localhost:5000/${localStorage.getItem('company_image')}`;

    let logoDataUrl = null;
    try {
      logoDataUrl = await getBase64FromUrl(logoUrl);
    } catch (err) {
      console.warn('Could not load logo image for PDF:', err);
    }

    const doc = new jsPDF('landscape');

    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', 10, 5, 40, 10);
    }

    doc.text(`${userName}'s ${selectedDate.toLocaleDateString('default', { month: 'long', year: 'numeric' })} Time-Entry Report`, 10, logoDataUrl ? 22 : 20);

    const columns = [
      { header: 'Project', dataKey: 'project' },
      { header: 'Task', dataKey: 'task' },
      ...Array.from({ length: daysInMonth }, (_, i) => ({ header: `${i + 1}`, dataKey: `day_${i + 1}` })),
      { header: 'Total', dataKey: 'total' }
    ];

    const rows = flattenedTaskData.map(item => {
      const row = {
        project: item.project,
        task: item.task,
        total: item.total
      };
      for (let i = 1; i <= 31; i++) {
        row[`day_${i}`] = item[`day_${i}`] || '-';
      }
      return row;
    });

    autoTable(doc, {
        startY: logoDataUrl ? 25 : 20,
        columns,
        body: rows,
        styles: { fontSize: 6.5, cellWidth: 'wrap' },
        columnStyles: { project: { cellWidth: 30 }, task: { cellWidth: 30 } },
        headStyles: { fillColor: [22, 160, 133] },
        margin: { top: 30, left: 10, right: 10 },
        didDrawPage: data => {
          const pageHeight = doc.internal.pageSize.height;
          const pageWidth = doc.internal.pageSize.width;
      
          // Page number (left)
          doc.setFontSize(10);
          doc.text(`Page ${doc.internal.getNumberOfPages()}`, data.settings.margin.left, pageHeight - 10);
      
          // Timestamp (right)
          const currentTime = new Date().toLocaleString();
          doc.text(`${currentTime}`, pageWidth - data.settings.margin.right - 60, pageHeight - 10); 
        }
      });
      

    doc.save(`${userName}_report.pdf`);
  };

  return (
    <Fragment>
      <Helmet>
        <title>Report | PMS</title>
      </Helmet>

      <Row>
        <Col xs={12}>
          <Card>
            <CardHeader className='border-bottom'>
              <CardTitle tag='h4'>Log report</CardTitle>
            </CardHeader>
            <CardBody className='pt-1'>
              <Formik
                initialValues={initialValues}
                enableReinitialize
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting }) => {
                  setFormSubmitted(false);
                  setUsersAllTask([]);
                  setFlattenedTaskData([]);
                  setUserName('');
                  setSubmittedValues({ ...values });
                  setSubmitting(false);
                }}
              >
                {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                  <Form>
                    <Row>
                      <Col sm='4' className='mb-1'>
                        <Label className='form-label' for='user'>Select User<span className='required'>*</span></Label>
                        <Field
                          as='select'
                          name='user'
                          className={`form-control ${errors.user && touched.user ? 'is-invalid' : ''}`}
                          onChange={e => {
                            const val = e.target.value;
                            setFieldValue('user', val);
                            setSelectedUser(val);
                          }}
                        >
                          <option value=''>Select User</option>
                          {users.map(user => (
                            <option key={user._id} value={user._id}>{user.first_name}</option>
                          ))}
                        </Field>
                        <ErrorMessage name='user' component='div' className='invalid-feedback' />
                      </Col>

                      <Col sm='4' className='mb-1'>
                        <Label className='form-label'>Select Project</Label>
                        <Field as='select' name='project' className='form-control'>
                          <option value=''>Select Project</option>
                          {projects.map(project => (
                            <option key={project._id} value={project._id}>{project.name}</option>
                          ))}
                        </Field>
                      </Col>

                      <Col sm='4' className='mb-1'>
                        <Label className='form-label'>Select Date</Label>
                        <Flatpickr
                          value={values.date}
                          onChange={([date], dateStr) => {
                            setFieldValue('date', dateStr);
                            setTimeout(() => setFieldTouched('date', true), 0);
                          }}
                          options={{
                            plugins: [new monthSelectPlugin({ shorthand: true, dateFormat: 'm-Y', altFormat: 'F Y' })],
                            allowInput: false,
                            disableMobile: true,
                            minDate: new Date(new Date().getFullYear() - 5, 0, 1),
                            maxDate: new Date()
                          }}
                          className='form-control'
                        />
                      </Col>

                      <Col sm='12' className='mt-1'>
                        <Button type='submit' color='primary' disabled={loading}>Show report</Button>
                      </Col>
                    </Row>

                    {loading ? (
                      <Spinner />
                    ) : formSubmitted && (
                      <Col xs={12} className='mt-2'>
                      {flattenedTaskData && flattenedTaskData.length > 0 && (
                            <Button
                                style={{ float: 'right' }}
                                color='primary'
                                onClick={downloadPDF}
                                className='mt-1'
                                title='PDF(Report)'
                            >
                                <Download size={16} />
                            </Button>
                                                                            )}
                        <div ref={reportRef}>
                          <Card>
                            <DataTableComponent
                              columns={reportColumn(currentPage, rowsPerPage)}
                              data={flattenedTaskData}
                              currentPage={currentPage}
                              rowsPerPage={rowsPerPage}
                              searchValue={searchValue}
                              setCurrentPage={setCurrentPage}
                              setRowsPerPage={setRowsPerPage}
                              setSearchValue={setSearchValue}
                            />
                          </Card>
                        </div>
                      </Col>
                    )}
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Index;
