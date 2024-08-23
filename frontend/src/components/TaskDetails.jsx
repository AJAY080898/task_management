import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Card, Button } from "react-bootstrap";
import { fetchTaskDetails, deleteTask } from "../store/tasksSlice";
import { useNavigate } from "react-router-dom";

function TaskDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const task = useSelector((state) => {
    return state.tasks.items.find((t) => t._id == id);
  });

  const status = useSelector((state) => state.tasks.status);

  useEffect(() => {
    if (!task) {
      dispatch(fetchTaskDetails(id));
    }
  }, [dispatch, id, task]);

  const handleDelete = () => {
    dispatch(deleteTask(id));
    navigate("/");
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "failed") return <div>Error loading task details</div>;
  if (!task) return <div>Task not found</div>;

  return (
    <Card>
      <Card.Body>
        <Card.Title>{task.title}</Card.Title>
        <Card.Text>{task.description}</Card.Text>
        <Card.Text>Due Date: {task.dueDate}</Card.Text>
        <Card.Text>Status: {task.status}</Card.Text>
        <Button variant="danger" onClick={handleDelete} className="mt-3">
          Delete Task
        </Button>
      </Card.Body>
    </Card>
  );
}

export default TaskDetails;
