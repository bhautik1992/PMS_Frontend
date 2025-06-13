// Corrected version of Country component with modal fix
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
  ModalBody
} from "reactstrap";
import { PlusSquare, ChevronDown } from "react-feather";
import { Helmet } from "react-helmet-async";
import { useDispatch, useSelector } from "react-redux";
import { getCountries } from "../../services/actions/CountryAction";
import { useState, useEffect, useMemo } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import axiosInstance from "../../helper/axiosInstance";
import DataTableComponent from "../Table/DataTableComponent";
import { countryTableColumn } from "../Table/Columns";
import { reOrderColumns } from "../Table/Columns";
import { CLOSE_POPUP, RESET_POPUP_REDUCER } from "../../services/constants";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";

const Country = () => {
  const [show, setShow] = useState(false);
  const [showStateModal, setShowStateModal] = useState(false);
  const [selectedCountryId, setSelectedCountryId] = useState(null);
  const [existingStates, setExistingStates] = useState([]);
  const [initialValues, setInitialValues] = useState({
    name: "",
    code: "",
    currency: "",
    symbol: "",
    countryId: "",
  });
  const [stateInitialValues, setStateInitialValues] = useState({
    name: "",
    stateId: "",
  });

  const validationSchema = Yup.object({
    name: Yup.string().required().max(30),
    code: Yup.string().required().max(2),
    currency: Yup.string().required().max(3),
    symbol: Yup.string().required().max(5),
  });
  const stateValidationSchema = Yup.object({
    name: Yup.string().required().max(50),
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchValue, setSearchValue] = useState("");

  const dispatch = useDispatch();
  const { countries, total } = useSelector((state) => state.CountryReducer);
  const { popup, editdata } = useSelector((state) => state.PopupReducer);

  useEffect(() => {
    dispatch(getCountries());
    dispatch({ type: RESET_POPUP_REDUCER });
  }, []);

  useEffect(() => {
    if (popup) {
      setShow(true);
      setInitialValues({
        name: editdata.name,
        code: editdata.code,
        currency: editdata.currency,
        symbol: editdata.symbol,
        countryId: editdata._id,
      });
    }
  }, [popup]);

  const resetForm = () => {
    setInitialValues({ name: "", code: "", currency: "", symbol: "", countryId: "" });
    setShow(true);
  };

  const resetStateForm = () => setStateInitialValues({ name: "", stateId: "" });

  const handleModalClosed = () => {
    setShow(false);
    dispatch({ type: CLOSE_POPUP });
  };

  const fetchStates = async (countryId) => {
    try {
      const response = await axiosInstance.get(`/states/${countryId}`);
      if (response.data) {
        setExistingStates(response.data.data);
      }
    } catch {
      toast.error("Failed to fetch states");
    }
  };

  const openStateModal = async (countryId) => {
    setSelectedCountryId(countryId);
    await fetchStates(countryId);
    resetStateForm();
    setShowStateModal(true);
  };

  const stateEdit = (state) => {
    setStateInitialValues({ name: state.name, stateId: state._id });
    setTimeout(() => setShowStateModal(true), 0);
  };

  const deleteState = async (state) => {
    try {
      const response = await axiosInstance.post("states/destroy", { stateId: state._id });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchStates(selectedCountryId);
      }
    } catch (error) {
      let errorMessage = error.response?.data?.message || import.meta.env.VITE_ERROR_MSG;
      toast.error(errorMessage);
    }
  };

  const onSubmit = async (values) => {
    try {
      const response = await axiosInstance.post("countrys/create", values);
      if (response.data.success) {
        setShow(false);
        toast.success(response.data.message);
        dispatch(getCountries());
      }
    } catch (error) {
      let errorMessage = error.response?.data?.message || import.meta.env.VITE_ERROR_MSG;
      toast.error(errorMessage);
    }
  };

  const tableColumn = useMemo(() => countryTableColumn(currentPage, rowsPerPage, openStateModal), [currentPage, rowsPerPage]);

  const CustomPagination = () => (
    <ReactPaginate
      nextLabel=''
      breakLabel='...'
      previousLabel=''
      pageRangeDisplayed={2}
      forcePage={currentPage}
      marginPagesDisplayed={2}
      activeClassName='active'
      pageClassName='page-item'
      breakClassName='page-item'
      nextLinkClassName='page-link'
      pageLinkClassName='page-link'
      breakLinkClassName='page-link'
      previousLinkClassName='page-link'
      nextClassName='page-item next-item'
      previousClassName='page-item prev-item'
      pageCount={Math.ceil(existingStates.length / 10) || 1}
      onPageChange={(page) => setCurrentPage(page.selected)}
      containerClassName='pagination react-paginate separated-pagination pagination-sm justify-content-end pe-1 mt-1'
    />
  );

  return (
    <>
      <Helmet><title>Geolocation | PMS</title></Helmet>
      <Row>
        <Col xs={12}>
          <Card>
            <CardHeader className="border-bottom d-flex justify-content-between align-items-center">
              <CardTitle tag="h4">Country List</CardTitle>
              <Button color="primary" size="sm" onClick={resetForm} outline>
                <PlusSquare size={15} />
              </Button>
            </CardHeader>
            <DataTableComponent
              columns={tableColumn}
              data={countries}
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

        {/* Country Modal */}
        <Modal onClosed={handleModalClosed} isOpen={show} toggle={() => setShow(!show)} className="modal-dialog-centered" autoFocus={false}>
          <ModalHeader className="bg-transparent" toggle={() => setShow(!show)}>
            <span>{initialValues.countryId ? "Edit Country" : "Add Country"}</span>
          </ModalHeader>
          <ModalBody className="px-sm-5 pb-5 modal-body">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              enableReinitialize
              onSubmit={onSubmit}
            >
              {({ errors, touched }) => (
                <Form>
                  <Row>
                    {['name', 'code', 'currency', 'symbol'].map((field, i) => (
                      <Col xs={12} key={i}>
                        <Label className="form-label" for={field}>{field.charAt(0).toUpperCase() + field.slice(1)}</Label>
                        <Field
                          name={field}
                          id={field}
                          className={`form-control ${errors[field] && touched[field] ? 'is-invalid' : ''}`}
                        />
                        <ErrorMessage name={field} component="div" className="invalid-feedback d-block" />
                      </Col>
                    ))}
                    <Col xs={12} className="text-center mt-2">
                      <Button type="submit" className="me-1" color="primary">
                        {initialValues.countryId ? "Update" : "Save"}
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

        {/* State Modal */}
        <Modal size="lg" onClosed={handleModalClosed} isOpen={showStateModal} toggle={() => setShowStateModal(!showStateModal)} className="modal-dialog-centered" autoFocus={false}>
          <ModalHeader className="bg-transparent" toggle={() => setShowStateModal(!showStateModal)}>
            <span>{stateInitialValues.stateId ? "Edit State" : "Add New State"}</span>
          </ModalHeader>
          <ModalBody className="px-sm-5 pb-5 modal-body">
            <Formik
              key={stateInitialValues.stateId || 'new'}
              initialValues={stateInitialValues}
              validationSchema={stateValidationSchema}
              enableReinitialize
              onSubmit={async (values) => {
                const payload = { state: values.name, countryId: selectedCountryId };
                try {
                  const response = values.stateId
                    ? await axiosInstance.put("states/edit", { ...payload, stateId: values.stateId })
                    : await axiosInstance.post("states/create", payload);
                  if (response.data.success) {
                    toast.success(response.data.message);
                    await fetchStates(selectedCountryId);
                    resetStateForm();
                  }
                } catch (error) {
                  let errorMessage = error.response?.data?.message || import.meta.env.VITE_ERROR_MSG;
                  toast.error(errorMessage);
                }
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <Row>
                    <Col xs={12}>
                      <Field name="name" id="name" className={`form-control ${errors.name && touched.name ? "is-invalid" : ""}`} />
                      <ErrorMessage name="name" component="div" className="invalid-feedback d-block" />
                    </Col>
                    <Col xs={12} className="text-center mt-2">
                      <Button type="submit" className="me-1" color="primary">
                        {stateInitialValues.stateId ? "Update" : "Save"}
                      </Button>
                      <Button outline type="reset" onClick={() => setShowStateModal(false)}>Cancel</Button>
                    </Col>
                    <Col xs={12} className="mb-2">
                      <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                        <Card className="overflow-hidden">
                          <CardHeader><CardTitle tag="h4">State List</CardTitle></CardHeader>
                          <div className="react-dataTable">
                            <DataTable
                              noHeader
                              pagination
                              data={existingStates}
                              columns={reOrderColumns(currentPage, rowsPerPage, stateEdit, deleteState)}
                              className="react-dataTable"
                              sortIcon={<ChevronDown size={10} />}
                              paginationComponent={CustomPagination}
                              paginationDefaultPage={currentPage + 1}
                              paginationRowsPerPageOptions={[10, 25, 50, 100]}
                            />
                          </div>
                        </Card>
                      </div>
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
