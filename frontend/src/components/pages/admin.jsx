import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Layout";
import { useNavigate } from "react-router-dom";
import { parseJwt } from "../../utils/helper";
import { Modal, Button, Form } from "react-bootstrap";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [editingTask, setEditingTask] = useState(null);

  const navigate = useNavigate();

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
    } else {
      const decodedToken = parseJwt(token);
      if (decodedToken.role?.toLowerCase() !== "admin") {
        navigate("/");
      } else {
        fetchUsers();
      }
    }
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/user");
      setUsers(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching users");
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId, role) => {
    try {
      await api.put(`/user/${userId}`, { role });
      setUsers(
        users.map((user) => (user._id === userId ? { ...user, role } : user))
      );
    } catch (err) {
      setError("Error updating user status");
    }
  };

  const openTaskModal = async (user) => {
    setSelectedUser(user);
    try {
      const response = await api.get(`/task?userId=${user._id}`);
      setTasks(response.data.data);
      setShowModal(true);
    } catch (err) {
      setError("Error fetching tasks");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setTasks([]);
    setEditingTask(null);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  const handleSaveTask = async () => {
    try {
      const { _id, title, description, status } = editingTask;
      await api.put(`/task/${_id}`, {
        title,
        description,
        status,
        userId: selectedUser._id,
      });
      setTasks(
        tasks.map((task) => (task._id === editingTask._id ? editingTask : task))
      );
      setEditingTask(null);
    } catch (err) {
      setError("Error updating task");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">{error}</div>;

  return (
    <Layout>
      <div className="container mt-5">
        <h1 className="mb-4">User List</h1>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Admin Status</th>
              <th>Action</th>
              <th>Tasks</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button
                    className={`btn btn-sm ${
                      user.role === "ADMIN" ? "btn-danger" : "btn-success"
                    }`}
                    onClick={() =>
                      toggleAdminStatus(
                        user._id,
                        user.role === "ADMIN" ? "USER" : "ADMIN"
                      )
                    }
                  >
                    {user.role === "ADMIN" ? "Revoke Admin" : "Make Admin"}
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => openTaskModal(user)}
                  >
                    Edit Tasks
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedUser?.name}'s Tasks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {tasks.length !== 0 ? (
            tasks.map((task) => (
              <div key={task._id} className="mb-3">
                <div className="mb-3">
                  {editingTask && editingTask._id === task._id ? (
                    <Form.Control
                      type="text"
                      value={editingTask.title}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          title: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <div>{task.title}</div>
                  )}
                </div>
                <div className="mb-3">
                  {editingTask && editingTask._id === task._id ? (
                    <Form.Control
                      as="textarea"
                      value={editingTask.description}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          description: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <div>{task.description}</div>
                  )}
                </div>
                <div className="mb-3">
                  {editingTask && editingTask._id === task._id ? (
                    <Form.Control
                      as="select"
                      value={editingTask.status}
                      onChange={(e) =>
                        setEditingTask({
                          ...editingTask,
                          status: e.target.value,
                        })
                      }
                    >
                      <option value="PENDING">Pending</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="COMPLETED">Completed</option>
                    </Form.Control>
                  ) : (
                    <div>{task.status}</div>
                  )}
                </div>
                <Button
                  variant="link"
                  onClick={() =>
                    editingTask ? handleSaveTask() : handleEditTask(task)
                  }
                >
                  {editingTask && editingTask._id === task._id
                    ? "Save"
                    : "Edit"}
                </Button>
              </div>
            ))
          ) : (
            <div>No tasks found</div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Layout>
  );
};

export default UserList;
