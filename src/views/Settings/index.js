import { Fragment, useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  CardHeader,
  Label,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../helper/axiosInstance";
import toast from "react-hot-toast";

import { useDropzone } from "react-dropzone";
import { FileText, X, DownloadCloud, Plus, Minus } from "react-feather";
import InputNumber from "rc-input-number"; // Assuming you're using rc-input-number

import "@styles/react/libs/flatpickr/flatpickr.scss";
import "@styles/react/pages/page-account-settings.scss";

import { Helmet } from "react-helmet-async";

const Index = () => {
  const [files, setFiles] = useState([]);

  const [initialValues, setInitialValues] = useState({
    orignal_code: "",
    emp_code: "",
    linkedin_url: "",
    twitter_url: "",
    company_image: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const response = await axiosInstance.get("settings");
        if (response.data.success) {
          setInitialValues((prevValue) => ({
            ...prevValue,
            ...response.data.data,
            orignal_code: response.data.data.emp_code,
          }));
        }
      } catch (error) {
        let errorMessage = import.meta.env.VITE_ERROR_MSG;

        if (error.response) {
          errorMessage =
            error.response.data?.message || JSON.stringify(error.response.data);
        } else if (error.request) {
          errorMessage = import.meta.env.VITE_NO_RESPONSE;
        }

        toast.error(errorMessage);
      }
    })();
  }, []);

  const validationSchema = Yup.object({
    emp_code: Yup.string().required().max(6).label("Employee Code"),
    linkedin_url: Yup.string()
      .required()
      .matches(
        /^https:\/\/([\w]+\.)?linkedin\.com\/.+$/,
        "Invalid LinkedIn URL format"
      )
      .max(50)
      .label("Linkedin URL"),
    twitter_url: Yup.string()
      .required()
      .matches(
        /^https:\/\/([\w]+\.)?twitter\.com\/.+$/,
        "Invalid Twitter URL format"
      )
      .max(50)
      .label("Twitter URL"),
  });

  const onSubmit = async (values) => {
    try {
      if (values.orignal_code !== values.emp_code) {
        const confirmChange = window.confirm(
          "Changing Employee Code will update all existing employee codes. Do you want to continue?"
        );
        if (!confirmChange) return;
      }
      const formData = new FormData();

      // Append text fields
      formData.append("emp_code", values.emp_code);
      formData.append("linkedin_url", values.linkedin_url);
      formData.append("twitter_url", values.twitter_url);

      // Append file if present
      if (files.length > 0) {
        formData.append("company_image", files[0]);
      }
      const response = await axiosInstance.post("settings", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.data.success) {
        toast.success(response.data.message);
        setInitialValues((prevValue) => ({
          ...prevValue,
          ...response.data.data,
          orignal_code: response.data.data.emp_code,
        }));
      }
    } catch (error) {
      let errorMessage = import.meta.env.VITE_ERROR_MSG;

      if (error.response) {
        errorMessage =
          error.response.data?.message || JSON.stringify(error.response.data);
      } else if (error.request) {
        errorMessage = import.meta.env.VITE_NO_RESPONSE;
      }

      toast.error(errorMessage);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFiles([acceptedFiles[0]]);
      }
    },
  });

  const renderFilePreview = (file) =>
    file.type.startsWith("image") ? (
      <img
        className="rounded"
        alt={file.name}
        src={URL.createObjectURL(file)}
        height="28"
        width="28"
      />
    ) : (
      <FileText size="28" />
    );

  const renderFileSize = (size) => {
    return Math.round(size / 100) / 10 > 1000
      ? `${(Math.round(size / 100) / 10000).toFixed(1)} mb`
      : `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
  };

  const handleRemoveFile = (fileToRemove) => {
    setFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileToRemove.name)
    );
  };

  const fileList = files.map((file, index) => (
    <ListGroupItem
      key={`${file.name}-${index}`}
      className="d-flex align-items-center justify-content-between"
    >
      <div className="file-details d-flex align-items-center">
        <div className="file-preview me-1">{renderFilePreview(file)}</div>
        <div>
          <p className="file-name mb-0">{file.name}</p>
          <p className="file-size mb-0">{renderFileSize(file.size)}</p>
        </div>
      </div>
      <Button
        color="danger"
        outline
        size="sm"
        className="btn-icon"
        onClick={() => handleRemoveFile(file)}
      >
        <X size={14} />
      </Button>
    </ListGroupItem>
  ));

  return (
    <Fragment>
      <Helmet>
        <title>Settings | PMS</title>
      </Helmet>
      <Row>
        <Col md="12">
          <Card>
            <CardBody className="pt-1">
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                enableReinitialize
                onSubmit={onSubmit}
              >
                {({ errors, touched, setFieldValue }) => (
                  <Form>
                    <Row>
                      <Col sm="4" className="mb-1">
                        <Label className="form-label" for="emp_code">
                          Employee Code<span className="required">*</span>
                        </Label>
                        <Field
                          type="text"
                          name="emp_code"
                          id="emp_code"
                          className={`form-control ${
                            errors.emp_code && touched.emp_code
                              ? "is-invalid"
                              : ""
                          }`}
                          maxLength={6}
                          autoComplete="off"
                          autoFocus
                        />
                        <ErrorMessage
                          name="emp_code"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Col>

                      <Col sm="4" className="mb-1">
                        <Label className="form-label" for="linkedin_url">
                          Linkedin URL<span className="required">*</span>
                        </Label>
                        <Field
                          type="text"
                          name="linkedin_url"
                          id="linkedin_url"
                          className={`form-control ${
                            errors.linkedin_url && touched.linkedin_url
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="https://www.linkedin.com/in/your-profile"
                          maxLength={50}
                          autoComplete="off"
                        />
                        <ErrorMessage
                          name="linkedin_url"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Col>

                      <Col sm="4" className="mb-1">
                        <Label className="form-label" for="twitter_url">
                          Twitter URL<span className="required">*</span>
                        </Label>
                        <Field
                          type="text"
                          name="twitter_url"
                          id="twitter_url"
                          className={`form-control ${
                            errors.twitter_url && touched.twitter_url
                              ? "is-invalid"
                              : ""
                          }`}
                          placeholder="https://twitter.com/your-username"
                          maxLength={50}
                          autoComplete="off"
                        />
                        <ErrorMessage
                          name="twitter_url"
                          component="div"
                          className="invalid-feedback"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col className="mt-1 mx-auto" sm="8">
                        <div {...getRootProps({ className: "dropzone" })}>
                          <input {...getInputProps()} />
                          <div className="d-flex align-items-center justify-content-center flex-column">
                            <DownloadCloud size={64} />
                            <h5>Drop Files here or click to upload</h5>
                            <p className="text-secondary">
                              Drop files here or click{" "}
                              <a href="/" onClick={(e) => e.preventDefault()}>
                                browse
                              </a>{" "}
                              through your machine
                            </p>
                          </div>
                        </div>
                        {files.length > 0 && (
                          <ListGroup className="my-2">{fileList}</ListGroup>
                        )}
                      </Col>
                    </Row>

                    <Row>
                      <Col className="mt-1" sm="12">
                        <Button type="submit" className="me-1" color="primary">
                          Save
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
  );
};

export default Index;
