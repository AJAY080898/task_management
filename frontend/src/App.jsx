import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import TaskList from "./components/pages/home";
import TaskForm from "./components/TaskForm";
import TaskDetails from "./components/TaskDetails";
import SearchBar from "./components/SearchBar";
import Notification from "./components/Notification";
import SignIn from "./components/pages/signin";
import SignUp from "./components/pages/signup";
import NotFound from "./components/pages/error";

function App() {
  return (
    <Router>
      <Navbar bg="light" expand="lg" className="mb-3">
        <Container>
          <Navbar.Brand href="/">Task Manager</Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/new">Add Task</Nav.Link>
          </Nav>
          <SearchBar />
        </Container>
      </Navbar>
      <Container>
        <Notification />
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/new" element={<TaskForm />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
