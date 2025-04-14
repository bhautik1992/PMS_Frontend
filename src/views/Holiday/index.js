import {
  Row,
  Col,
  Card,
  CardHeader,
  CardTitle,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { Helmet } from "react-helmet-async";
import { PlusSquare } from "react-feather";
import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createHoliday,
  getHolidays,
} from "../../services/actions/HolidayAction";
import DataTableComponent from "../Table/DataTableComponent";
import { holidayTableColumn } from "../Table/Columns/holiday";
import Flatpickr from "react-flatpickr";
import "@styles/react/libs/flatpickr/flatpickr.scss";
// Inside your component:

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const Holiday = () => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    start_date: "",
    end_date: "",
  });

  const validationSchema = Yup.object({
    name: Yup.string().required().max(50).label("Name"),
    start_date: Yup.string().required().label("Strat Date"),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  const tableColumn = useMemo(
    () => holidayTableColumn(currentPage, rowsPerPage),
    [currentPage, rowsPerPage]
  );

  const [show, setShow] = useState(false);

  //   const handleModalClosed = () => {
  //       setShow(false);
  //       dispatch({ type: CLOSE_POPUP });
  //       setInitialValues({
  //         name: "",
  //         roleId: "",
  //       });
  //   };

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getHolidays());
  }, []);

  const { holidays } = useSelector((state) => state.HolidayReducer);
  console.log(holidays);
  return (
    <>
      <Helmet>
        <title>Holiday | PMS</title>
      </Helmet>

      <Row>
        <Col xs={12}>
          <Card>
            <CardHeader className="border-bottom">
              <CardTitle tag="h4">Holiday List</CardTitle>

              <CardTitle tag="h4">
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => {
                    setInitialValues((prevVal) => ({
                      ...prevVal,
                      name: "",
                      start_date: "",
                      end_date: "",
                    }));

                    setShow(true);
                  }}
                  outline
                >
                  <PlusSquare size={15} />
                </Button>
              </CardTitle>
            </CardHeader>
          </Card>
        </Col>
        <DataTableComponent
          columns={tableColumn}
          data={holidays.Holidays}
          total={holidays.total}
          currentPage={currentPage}
          rowsPerPage={rowsPerPage}
          searchValue={searchValue}
          setCurrentPage={setCurrentPage}
          setRowsPerPage={setRowsPerPage}
          setSearchValue={setSearchValue}
        />
        <Modal
          //   onClosed={handleModalClosed}
          isOpen={show}
          toggle={() => setShow(!show)}
          className="modal-dialog-centered"
          autoFocus={false}
        >
          <ModalHeader className="bg-transparent" toggle={() => setShow(!show)}>
            <span>Add Holiday</span>
          </ModalHeader>

          <ModalBody className="px-sm-5 pb-5 modal-body">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize={true}
              onSubmit={(values) => {
                const toISO = (dateStr) => {
                  const [day, month, year] = dateStr.split("-");
                  return new Date(`${year}-${month}-${day}`)
                    .toISOString()
                    .split("T")[0];
                };

                const finalvalues = {
                  ...values,
                  start_date: toISO(values.start_date),
                  end_date: values.end_date
                    ? toISO(values.end_date)
                    : toISO(values.start_date),
                };

                dispatch(createHoliday(finalvalues));
                setShow(false);
              }}
            >
              {({
                errors,
                touched,
                setFieldValue,
                setTouched,
                setFieldError,
                setFieldTouched,
                validateField,
                values,
              }) => (
                <Form>
                  <Row>
                    <Col xs={12}>
                      <Label className="form-label" for="name">
                        Holiday Name<span className="required">*</span>
                      </Label>

                      <Field
                        type="text"
                        name="name"
                        id="name"
                        className="form-control"
                        maxLength={50}
                        autoComplete="off"
                        autoFocus
                      />

                      <ErrorMessage
                        name="name"
                        component="div"
                        className="invalid-feedback d-block"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <Label className="form-label" for="start_date">
                        Start Date<span className="required">*</span>
                      </Label>

                      <Flatpickr
                        name="start_date"
                        id="start_date"
                        className={`form-control ${
                          errors.start_date && touched.start_date
                            ? "is-invalid rm-op"
                            : ""
                        }`}
                        value={values.start_date}
                        onChange={(dates, dateStr) => {
                          setFieldValue("start_date", dateStr);
                          setFieldError("start_date", "");
                        }}
                        onBlur={(e) => {
                          setTimeout(() => {
                            setFieldTouched("start_date", true);
                            validateField("start_date");
                          }, 100);
                        }}
                        options={{
                          dateFormat: "d-m-Y",
                          allowInput: false,
                          clickOpens: true,
                          disableMobile: true,
                          minDate: new Date(new Date().getFullYear(), 0, 1),
                        }}
                      />

                      <ErrorMessage
                        name="start_date"
                        component="div"
                        className="invalid-feedback"
                      />
                    </Col>
                  </Row>

                  <Row>
                    <Col md="12">
                      <Label className="form-label" for="end_date">
                        End Date
                      </Label>

                      <Flatpickr
                        name="end_date"
                        id="end_date"
                        value={values.end_date}
                        className={`form-control ${
                          errors.end_date && touched.end_date
                            ? "is-invalid rm-op"
                            : ""
                        }`}
                        onChange={([date], dateStr) => {
                          const startDate = values.start_date
                            ? new Date(values.start_date)
                            : null;
                          const endDate = new Date(dateStr);

                          if (startDate && endDate <= startDate) {
                            setFieldValue("end_date", "");
                            setFieldError(
                              "end_date",
                              "End date must be greater than start date"
                            );
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
                            ? new Date(
                                new Date(values.start_date).getTime() + 86400000
                              )
                            : null,
                        }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={12} className="text-center mt-2">
                      <Button type="submit" className="me-1" color="primary">
                        Save
                      </Button>
                      <Button
                        outline
                        type="reset"
                        onClick={() => setShow(false)}
                      >
                        Cancel
                      </Button>
                    </Col>
                  </Row>
                </Form>
              )}
            </Formik>
          </ModalBody>
        </Modal>
      </Row>
    </>
  );
};

export default Holiday;
