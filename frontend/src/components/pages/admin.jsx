import { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../Layout";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get(import.meta.env.VITE_API_URL + "/user");
      setUsers(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching users");
      setLoading(false);
    }
  };

  const toggleAdminStatus = async (userId, role) => {
    try {
      await api.put(`${import.meta.env.VITE_API_URL}/user/${userId}`, {
        role,
      });
      setUsers(
        users.map((user) => (user._id === userId ? { ...user, role } : user))
      );
    } catch (err) {
      setError("Error updating user status");
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
};

export default UserList;
