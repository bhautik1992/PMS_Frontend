import { Row, Col, Label, Button } from "reactstrap";
import { useDispatch } from "react-redux";
import { updateCountry } from "../../services/actions/CountryAction";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { useNavigate, useParams } from "react-router-dom";

const Country = () => {
  const [initialValues, setInitialValues] = useState({
    name: "",
    code: "",
    currency: "",
    symbol: "",
  });

  const validationSchema = Yup.object({
    name: Yup.string().required("Country name is required").max(30),
    code: Yup.string().required("Country code is required").max(2),
    currency: Yup.string().required("Currency is required").max(3),
    symbol: Yup.string().required("Symbol is required").max(5),
  });

  const dispatch = useDispatch();
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={(values) => {
          dispatch(updateCountry(id, values));
          return navigate("/countries");
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
                  Country Name<span className="required">*</span>
                </Label>
                <Field
                  name="name"
                  id="name"
                  autoFocus
                  className={`form-control ${
                    errors.name && touched.name ? "is-invalid" : ""
                  }`}
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="invalid-feedback d-block"
                />
              </Col>

              <Col xs={12}>
                <Label className="form-label" for="code">
                  Country Code<span className="required">*</span>
                </Label>
                <Field
                  name="code"
                  id="code"
                  className={`form-control ${
                    errors.code && touched.code ? "is-invalid" : ""
                  }`}
                />
                <ErrorMessage
                  name="code"
                  component="div"
                  className="invalid-feedback d-block"
                />
              </Col>

              <Col xs={12}>
                <Label className="form-label" for="currency">
                  Currency<span className="required">*</span>
                </Label>
                <Field
                  name="currency"
                  id="currency"
                  className={`form-control ${
                    errors.currency && touched.currency ? "is-invalid" : ""
                  }`}
                />
                <ErrorMessage
                  name="currency"
                  component="div"
                  className="invalid-feedback d-block"
                />
              </Col>

              <Col xs={12}>
                <Label className="form-label" for="symbol">
                  Symbol<span className="required">*</span>
                </Label>
                <Field
                  name="symbol"
                  id="symbol"
                  className={`form-control ${
                    errors.symbol && touched.symbol ? "is-invalid" : ""
                  }`}
                />
                <ErrorMessage
                  name="symbol"
                  component="div"
                  className="invalid-feedback d-block"
                />
              </Col>

              <Col xs={12} className="text-center mt-2">
                <Button type="submit" className="me-1" color="primary">
                  Save
                </Button>
                <Button
                  outline
                  type="reset"
                  onClick={() => navigate("/countries")}
                >
                  Cancel
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default Country;
