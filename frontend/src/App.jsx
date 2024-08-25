import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TaskList from "./components/pages/home";
import TaskForm from "./components/TaskForm";
import TaskDetails from "./components/TaskEdit";
import SignIn from "./components/pages/signin";
import SignUp from "./components/pages/signup";
import NotFound from "./components/pages/error";
import UserList from "./components/pages/admin";
import { Container } from "react-bootstrap";

function App() {
  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<TaskList />} />
          <Route path="/new" element={<TaskForm />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/admin" element={<UserList />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
