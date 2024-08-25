import SearchBar from "./SearchBar";
import { useEffect, useState } from "react";
import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Notification from "./Notification";

const Layout = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.reload();
  };

  return (
    <div>
      {!isAuthenticated ? null : (
        <>
          <Navbar bg="light" expand="lg" className="mb-3">
            <Container>
              <Navbar.Brand href="/">Task Manager</Navbar.Brand>
              <Nav className="mr-auto d-flex gap-2">
                <Link to="/">Home</Link>
                <Link to="/new">Add Task</Link>
                <Link to="/admin">Admin</Link>
              </Nav>
              <SearchBar />
            </Container>
          </Navbar>
          <Container>
            <div className="d-flex justify-content-end mb-3">
              <Button onClick={handleLogout}>Logout</Button>
            </div>
            <Notification />
            {props.children}
          </Container>
        </>
      )}
    </div>
  );
};

export default Layout;
