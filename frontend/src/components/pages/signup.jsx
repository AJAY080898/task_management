import { useFormik } from "formik";
import axios from "axios";

const validate = (values) => {
  const errors = {};

  if (!values.name) {
    errors.name = "Required";
  } else if (values.name.length > 15) {
    errors.name = "Must be 15 characters or less";
  }

  if (!values.email) {
    errors.email = "Required";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    errors.email = "Invalid email address";
  }

  if (!values.password) {
    errors.password = "Required";
  } else if (values.password.length > 15 || values.password.length < 6) {
    errors.password = "Must be 6-15 characters";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Required";
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = "Password does not match";
  }

  return errors;
};

const SignUp = () => {
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      role: "user",
      password: "",
      confirmPassword: "",
    },
    validate,
    onSubmit: (values) => {
      const { confirmPassword, ...data } = values;
      axios
        .post(import.meta.env.VITE_API_URL + "/user/signup", data)
        .then((response) => {
          console.log(response);
          alert("Sign up successful");
        })
        .catch((error) => {
          console.log(error);
          alert("Sign up failed");
        });
    },
  });
  return (
    <div className="d-flex justify-content-center align-items-center mt-5 flex-column min-vh-100">
      <h1 className="h3 mb-3 font-weight-normal w-100 text-center">Sign up</h1>
      <form onSubmit={formik.handleSubmit} className="form-signin col-md-6">
        <div className="form-group mb-3">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            className={`form-control ${formik.errors.name ? "is-invalid" : ""}`}
            onChange={formik.handleChange}
            value={formik.values.name}
          />
          {formik.errors.name ? (
            <small className="invalid-feedback">{formik.errors.name}</small>
          ) : null}
        </div>

        <div className="form-group mb-3">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            className={`form-control ${
              formik.errors.email ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.email}
          />
          {formik.errors.email ? (
            <small className="invalid-feedback">{formik.errors.email}</small>
          ) : null}
        </div>

        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="role"
            id="user"
            value="user"
            checked={formik.values.role === "user"}
            onChange={formik.handleChange}
          />
          <label className="form-check-label" htmlFor="user">
            User
          </label>
        </div>
        <div className="form-check mb-3 form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            name="role"
            id="admin"
            value="admin"
            onChange={formik.handleChange}
            checked={formik.values.role === "admin"}
          />
          <label className="form-check-label" htmlFor="admin">
            Admin
          </label>
        </div>
        <div className="form-group mb-3">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="text"
            className={`form-control ${
              formik.errors.password ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.password}
          />
          {formik.errors.password ? (
            <small className="invalid-feedback">{formik.errors.password}</small>
          ) : null}
        </div>
        <div className="form-group mb-3">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="text"
            className={`form-control ${
              formik.errors.confirmPassword ? "is-invalid" : ""
            }`}
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
          />
          {formik.errors.confirmPassword ? (
            <small className="invalid-feedback">
              {formik.errors.confirmPassword}
            </small>
          ) : null}
        </div>
        <p className="mt-3 text-center">
          Already have an account? <a href="/signin">Sign in</a>
        </p>

        <button type="submit" className="btn btn-primary">
          Sign up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
