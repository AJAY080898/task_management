import { useDispatch } from "react-redux";
import { addTask } from "../store/tasksSlice";
import { clearNotification, setNotification } from "../store/notificationSlice";
import { useEffect } from "react";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Layout from "./Layout";

const validate = (values) => {
  const errors = {};

  if (!values.title) {
    errors.title = "Required";
  }

  if (!values.description) {
    errors.description = "Required";
  }

  return errors;
};

const TaskForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    }
  }, [navigate]);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      dueDate: "",
      status: "PENDING",
    },
    validate,
    onSubmit: (values) => {
      dispatch(addTask(values));
      dispatch(
        setNotification({
          message: "Task created successfully",
          type: "success",
        })
      );
      navigate("/");

      setTimeout(() => dispatch(clearNotification()), 5000);
    },
  });

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/signin");
    }
  }, []);

  return (
    <Layout>
      <div className="d-flex justify-content-center align-items-center mt-5 flex-column min-vh-100">
        <h1 className="h3 mb-3 font-weight-normal w-100 text-center">
          Create Task
        </h1>
        <form onSubmit={formik.handleSubmit} className="form-signin col-md-6">
          <div className="form-group mb-3">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              type="title"
              className={`form-control ${
                formik.errors.title ? "is-invalid" : ""
              }`}
              onChange={formik.handleChange}
              value={formik.values.title}
            />
            {formik.errors.title ? (
              <small className="invalid-feedback">{formik.errors.title}</small>
            ) : null}
          </div>

          <div className="form-group mb-3">
            <label htmlFor="description">Description</label>
            <input
              id="description"
              name="description"
              type="description"
              className={`form-control ${
                formik.errors.description ? "is-invalid" : ""
              }`}
              onChange={formik.handleChange}
              value={formik.values.description}
            />
            {formik.errors.description ? (
              <small className="invalid-feedback">
                {formik.errors.description}
              </small>
            ) : null}
          </div>

          <div className="form-group mb-3">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Basic date time picker"
                onChange={(date) => formik.setFieldValue("dueDate", date.$d)}
              />
            </LocalizationProvider>
          </div>

          <button type="submit" className="btn btn-primary">
            Create Task
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default TaskForm;
