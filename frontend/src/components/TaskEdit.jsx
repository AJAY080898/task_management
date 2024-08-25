import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { updateTask } from "../store/tasksSlice";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Form as BootstrapForm, Button } from "react-bootstrap";
import { clearNotification, setNotification } from "../store/notificationSlice";
import Layout from "./Layout";
import { parseJwt } from "../utils/helper";

const TaskSchema = Yup.object().shape({
  title: Yup.string().required("Required"),
  description: Yup.string(),
  dueDate: Yup.date(),
  status: Yup.string().oneOf(["PENDING", "IN_PROGRESS", "COMPLETED"]),
});

function TaskDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isAdmin, setIsAdmin] = useState(false);

  const task = useSelector((state) => {
    return state.tasks.items.find((t) => t._id == id);
  });

  const status = useSelector((state) => state.tasks.status);

  useEffect(() => {
    if (!task) {
      navigate("/");
    }

    const token = localStorage.getItem("token");
    if (token) {
      const decodedToken = parseJwt(token);
      if (decodedToken.role?.toLowerCase() === "admin") {
        setIsAdmin(true);
      }
    }
  }, []);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error loading task details</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <Layout>
      <Formik
        initialValues={{
          title: task.title,
          description: task.description,
          dueDate: task.dueDate,
          status: task.status,
        }}
        validationSchema={TaskSchema}
        onSubmit={(values, { setSubmitting }) => {
          dispatch(updateTask({ task: values, id: task._id }));
          dispatch(
            setNotification({
              message: "Task updated successfully",
              type: "warning",
            })
          );
          navigate("/");

          setTimeout(() => dispatch(clearNotification()), 5000);
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form>
            <BootstrapForm.Group>
              <BootstrapForm.Label>Title</BootstrapForm.Label>
              {isAdmin ? (
                <Field
                  name="title"
                  as={BootstrapForm.Control}
                  isInvalid={touched.title && errors.title}
                />
              ) : (
                <BootstrapForm.Control
                  plaintext
                  readOnly
                  defaultValue={task.title}
                />
              )}
              <BootstrapForm.Control.Feedback type="invalid">
                {errors.title}
              </BootstrapForm.Control.Feedback>
            </BootstrapForm.Group>

            <BootstrapForm.Group>
              <BootstrapForm.Label>Description</BootstrapForm.Label>
              {isAdmin ? (
                <Field
                  name="description"
                  as={BootstrapForm.Control}
                  isInvalid={touched.description && errors.description}
                />
              ) : (
                <BootstrapForm.Control
                  plaintext
                  readOnly
                  defaultValue={task.description}
                />
              )}
            </BootstrapForm.Group>

            <BootstrapForm.Group>
              <BootstrapForm.Label>Status</BootstrapForm.Label>
              <Field name="status" as="select" className="form-control">
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </Field>
            </BootstrapForm.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={isSubmitting}
              className="mt-3"
            >
              Update Task
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
}

export default TaskDetails;
