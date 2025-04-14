import {Row, Col, Card, CardHeader, CardTitle, Label, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import { Helmet } from "react-helmet-async";
import { PlusSquare } from "react-feather";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getHolidays } from "../../services/actions/HolidayAction";
import DataTableComponent from "../Table/DataTableComponent";
import { holidayTableColumn } from "../Table/Columns";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CanAccess from "../../helper/CanAccess";
import { PERMISSION_ACTION } from "../../helper/constants";
import { CLOSE_POPUP, RESET_POPUP_REDUCER } from '../../services/constants';
import toast from "react-hot-toast";
import axiosInstance from "../../helper/axiosInstance";
import moment from 'moment';

const Holiday = () => {
    const [show, setShow] = useState(false);
    const dispatch = useDispatch();

    const { holidays, total } = useSelector((state) => state.HolidayReducer);
    const { popup, editdata }    = useSelector((state) => state.PopupReducer);

    const [initialValues, setInitialValues] = useState({
        name      : "",
        start_date: "",
        end_date  : "",
        holidayId :'',
    });

    const validationSchema = Yup.object({
        name: Yup.string().required().max(50).label("Name"),
        start_date: Yup.string().required().label("Strat Date"),
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchValue, setSearchValue] = useState("");

    useEffect(() => {
        dispatch(getHolidays());
    }, []);
  
    const requestForm = () => {
        setInitialValues((prevVal) => ({
            ...prevVal,
            name      : "",
            start_date: "",
            end_date  : "",
            holidayId : "",
        }));

        setShow(true);
    }

    const handleModalClosed = () => {
        setShow(false);
        dispatch({type:CLOSE_POPUP});
    }

    // Start - Manage Popup
    useEffect(() => {
        dispatch({type:RESET_POPUP_REDUCER});
    },[]);

    useEffect(() => {
        if(popup){
            setShow(true)
            
            setInitialValues(prevVal => ({
                ...prevVal,
                name:editdata.name,
                start_date: moment(editdata.start_date).format("DD-MM-YYYY"),
                end_date:editdata.end_date && moment(editdata.end_date).format("DD-MM-YYYY"),
                holidayId:editdata._id
            }))
        }
    },[popup])
    // End - Manage Popup
    
    const onSubmit = async (values) => {
        try {
            const response = await axiosInstance.post('holidays/create', values);

            if(response.data.success){
                setShow(false);
                toast.success(response.data.message);
                dispatch(getHolidays(currentPage, rowsPerPage, searchValue));
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
    
    const tableColumn = useMemo(() => holidayTableColumn(currentPage, rowsPerPage),[currentPage, rowsPerPage]);
  
    return (
        <>
            <Helmet>
                <title>Holidays | PMS</title>
            </Helmet>

            <Row>
                <Col xs={12}>
                    <Card>
                        <CardHeader className="border-bottom">
                            <CardTitle tag="h4">Holidays List</CardTitle>

                            <CanAccess permission={PERMISSION_ACTION.HOLIDAY_CREATE}>
                                <CardTitle tag="h4">
                                    <Button
                                        color="primary"
                                        size="sm"
                                        onClick={() => requestForm()}
                                        outline
                                        >
                                        <PlusSquare size={15} />
                                    </Button>
                                </CardTitle>
                            </CanAccess>
                        </CardHeader>
        
                        <DataTableComponent
                            columns={tableColumn}
                            data={holidays}
                            total={total}
                            currentPage={currentPage}
                            rowsPerPage={rowsPerPage}
                            searchValue={searchValue}
                            setCurrentPage={setCurrentPage}
                            setRowsPerPage={setRowsPerPage}
                            setSearchValue={setSearchValue}
                        />
                    </Card>
                </Col>
            </Row>
                
            <Modal onClosed={handleModalClosed} isOpen={show} toggle={() => setShow(!show)} className="modal-dialog-centered" autoFocus={false}>
                <ModalHeader className="bg-transparent" toggle={() => setShow(!show)}>
                    <span>{initialValues.holidayId ? 'Edit Holiday' : 'Add holiday'}</span>
                </ModalHeader>

                <ModalBody className="px-sm-5 pb-5 modal-body">
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    enableReinitialize={true}
                    onSubmit={onSubmit}
                >
                    {({errors,touched,setFieldValue,setTouched,setFieldError,setFieldTouched,validateField,values}) => (
                        <Form>
                            <Row>
                                <Col xs={12}>
                                    <Label className="form-label" for="name">
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

                                    <ErrorMessage name="name" component="div" className="invalid-feedback d-block"/>
                                </Col>
                            </Row>

                            <Row className="mt-1">
                                <Col md="12">
                                    <Label className="form-label" for="start_date">
                                        Start Date<span className="required">*</span>
                                    </Label>

                                    <Flatpickr
                                        name="start_date"
                                        id="start_date"
                                        value={values.start_date}
                                        className={`form-control ${errors.start_date && touched.start_date? "is-invalid rm-op": ""}`}
                                        onChange={([date], dateStr) => {
                                            setFieldValue("start_date", dateStr);
                                            setFieldTouched("start_date", true, true);
                                            setFieldError("start_date", "");

                                            // Clear end_date if it's not greater than new start_date
                                            if (values.end_date) {
                                                const endDateObj = new Date(values.end_date.split("-").reverse().join("-")); // parse d-m-Y
                                                const startDateObj = new Date(dateStr.split("-").reverse().join("-"));
                                    
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
                                            dateFormat: "d-m-Y",
                                            allowInput: false,
                                            clickOpens: true,
                                            disableMobile: true,
                                        }}
                                    />

                                    <ErrorMessage name="start_date" component="div" className="invalid-feedback"/>
                                </Col>
                            </Row>

                            <Row className="mt-1">
                                <Col md="12">
                                    <Label className="form-label" for="end_date">
                                        End Date
                                    </Label>

                                    <Flatpickr
                                        name="end_date"
                                        id="end_date"
                                        value={values.end_date}
                                        className={`form-control ${errors.end_date && touched.end_date ? "is-invalid rm-op" : ""}`}
                                        onChange={([date], dateStr) => {
                                            const startDate = values.start_date
                                                ? new Date(values.start_date.split("-").reverse().join("-"))
                                                : null;
                                            const endDate = new Date(dateStr.split("-").reverse().join("-"));
                                    
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
                                            dateFormat: "d-m-Y",
                                            allowInput: false,
                                            clickOpens: true,
                                            disableMobile: true,
                                            minDate: values.start_date
                                                ? moment(values.start_date, "DD-MM-YYYY").add(1, "day").toDate()
                                                : null,
                                        }}
                                    />
                                </Col>
                            </Row>

                            <Row className="mt-1">
                                <Col xs={12} className="text-center">
                                    <Button type="submit" className="me-1" color="primary">
                                        {initialValues.holidayId ? 'Update' : 'Save'}
                                    </Button>
                                    
                                    <Button outline type="reset" onClick={() => setShow(false)}>
                                        Cancel
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </Formik>
                </ModalBody>
            </Modal>
        </>
    );
}

export default Holiday;


