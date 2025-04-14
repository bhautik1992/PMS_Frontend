import {
  Row,
  Col,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css"; // or your preferred theme
import { useDispatch } from "react-redux";
import { updateHoliday } from "../../services/actions/HolidayAction";
import { useNavigate, useParams } from "react-router-dom";

const Index = () => {
  const dispatch = useDispatch();
  const { id: holidayId } = useParams();

  const initialValues = {
    name: "",
    start_date: "",
    end_date: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required().max(50).label("Name"),
    start_date: Yup.string().required().label("Strat Date"),
  });

  const navigate = useNavigate();

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize={true}
        onSubmit={(values) => {
          dispatch(updateHoliday(holidayId, values));
          return navigate("/holiday");
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
                    dateFormat: "Y-m-d",
                    allowInput: false,
                    clickOpens: true,
                    disableMobile: true,
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
                    dateFormat: "Y-m-d",
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
                  onClick={() => navigate("/holiday")}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Index;
