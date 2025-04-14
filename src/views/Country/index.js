import {
  Card,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Label,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import { PlusSquare } from "react-feather";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import {
  getCountries,
  createCountry,
} from "../../services/actions/CountryAction";
import { useState, useEffect, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";  
import * as Yup from "yup";

import DataTableComponent from "../Table/DataTableComponent";
import { countryTableColumn } from "../Table/Columns/country";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  const tableColumn = useMemo(
    () => countryTableColumn(currentPage, rowsPerPage),
    [currentPage, rowsPerPage]
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCountries());
  }, []);

  const [show, setShow] = useState(false);

  const { countries } = useSelector((state) => state.CountryReducer);
  return (
    <>
      {" "}
      <Helmet>
        <title>Country | PMS</title>
      </Helmet>
      <Row>
        <Col xs={12}>
          <Card>
            <CardHeader className="border-bottom">
              <CardTitle tag="h4">Country List</CardTitle>
              <CardTitle tag="h4">
                <Button
                  color="primary"
                  size="sm"
                  onClick={() => {
                    setInitialValues({
                      name: "",
                      code: "",
                      currency: "",
                      symbol: "",
                    });
                    setShow(true);
                  }}
                  outline
                >
                  <PlusSquare size={15} />
                </Button>
              </CardTitle>
            </CardHeader>
            <DataTableComponent
              columns={tableColumn}
              data={countries.countries}
              total={countries.total}
              currentPage={currentPage}
              rowsPerPage={rowsPerPage}
              searchValue={searchValue}
              setCurrentPage={setCurrentPage}
              setRowsPerPage={setRowsPerPage}
              setSearchValue={setSearchValue}
            />
          </Card>
        </Col>

        {/* Modal */}
        <Modal
          isOpen={show}
          toggle={() => setShow(!show)}
          className="modal-dialog-centered"
          autoFocus={false}
        >
          <ModalHeader className="bg-transparent" toggle={() => setShow(!show)}>
            <span>Add Country</span>
          </ModalHeader>

          <ModalBody className="px-sm-5 pb-5 modal-body">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={(values) => {
                dispatch(createCountry(values));
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
                          errors.currency && touched.currency
                            ? "is-invalid"
                            : ""
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

export default Country;
