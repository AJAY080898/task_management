import { useSelector } from "react-redux";
import { Button, Container, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  clearNotification,
  setNotification,
} from "../../store/notificationSlice";
import { useDispatch } from "react-redux";
import { deleteTask, fetchTasks } from "../../store/tasksSlice";
import { useEffect } from "react";
import Layout from "../Layout";

function TaskList() {
  const tasks = useSelector((state) => state.tasks.items);
  const status = useSelector((state) => state.tasks.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const filterQuery = useSelector((state) => state.tasks.query) || "";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchTasks());
    } else {
      navigate("/signin");
    }
  }, [dispatch, navigate]);

  const handleDelete = (id) => {
    dispatch(deleteTask(id));

    dispatch(
      setNotification({
        message: "Task deleted successfully",
        type: "success",
      })
    );

    setTimeout(() => {
      dispatch(clearNotification());
    }, 3000);
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error loading tasks</div>;

  setInterval(() => {
    const overdueTasks = tasks.filter(
      (task) =>
        task.status !== "COMPLETED" &&
        new Date(task.dueDate) < new Date(Date.now() + 30 * 60000)
    );

    if (overdueTasks.length > 0) {
      dispatch(
        setNotification({
          message: "You have some pending task that are overdue",
          type: "danger",
        })
      );
    } else {
      setNotification({
        message: "",
      });
    }
  }, 5000);

  if (tasks.length === 0) {
    return (
      <Layout>
        <Container>
          No tasks found &nbsp;
          <Link to="/new" className="link-primary">
            Add Task
          </Link>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <ListGroup>
        {tasks.map(
          (task) =>
            task?.title
              ?.toLowerCase()
              ?.includes(filterQuery?.toLowerCase()) && (
              <ListGroup.Item key={task._id} className="">
                <div className="card-body">
                  <h5 className="card-title">{task.title}</h5>
                  <div className="d-flex gap-3 mt-2">
                    <span
                      className={`mb-3 badge ${
                        task.status === "COMPLETED"
                          ? "bg-success"
                          : task.status === "IN_PROGRESS"
                          ? "bg-warning"
                          : "bg-danger"
                      }`}
                    >
                      {task.status === "COMPLETED"
                        ? "Completed"
                        : task.status === "IN_PROGRESS"
                        ? "In Progress"
                        : "Pending"}
                    </span>

                    <span className="card-subtitle mb-2 text-muted">
                      Due: {new Date(task.dueDate).toLocaleString()}
                    </span>
                  </div>
                  <p className="card-text">{task.description}</p>
                  <div className="d-flex gap-3">
                    <Link to={"/task/" + task._id} className="btn btn-primary">
                      Edit
                    </Link>
                    <Button
                      onClick={() => handleDelete(task._id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </ListGroup.Item>
            )
        )}
      </ListGroup>
    </Layout>
  );
}

export default TaskList;
