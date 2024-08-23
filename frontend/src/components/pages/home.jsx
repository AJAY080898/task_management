import { useSelector } from "react-redux";
import { Button, ListGroup } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  clearNotification,
  setNotification,
} from "../../store/notificationSlice";
import { useDispatch } from "react-redux";
import { fetchTasks } from "../../store/tasksSlice";
import { useEffect } from "react";

function TaskList() {
  const tasks = useSelector((state) => state.tasks.items);
  const status = useSelector((state) => state.tasks.status);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchTasks());
    } else {
      navigate("/signin");
    }
  }, [dispatch, navigate]);

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error loading tasks</div>;

  setTimeout(() => {
    const now = new Date();
    const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const dueTasks = tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      return dueDate > now && dueDate < nextDay;
    });

    if (dueTasks.length > 0) {
      dispatch(
        setNotification({
          message: `You have ${dueTasks.length} task(s) due today`,
          type: "warning",
        })
      );
    } else {
      dispatch(clearNotification());
    }
  }, 1000);

  return (
    <ListGroup>
      {tasks.map((task) => (
        <ListGroup.Item key={task._id} className="">
          <div className="card-body">
            <h5 className="card-title">{task.title}</h5>
            <h6
              className={`card-subtitle mb-2 badge ${
                task.status === "COMPLETED"
                  ? "badge-success"
                  : task.status === "IN_PROGRESS"
                  ? "badge-warning"
                  : "badge-danger"
              }`}
            >
              {task.status === "COMPLETED"
                ? "Completed"
                : task.status === "IN_PROGRESS"
                ? "In Progress"
                : "Pending"}
            </h6>
            <p className="card-text">{task.description}</p>
            <Link href="#" className="btn btn-primary">
              Edit
            </Link>
            <Button onClick={console.log} className="btn btn-danger">
              Delete
            </Button>
          </div>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}

export default TaskList;
