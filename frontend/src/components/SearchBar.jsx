import { useState } from "react";
import { useDispatch } from "react-redux";
import { Form, FormControl, Button } from "react-bootstrap";
// import { searchTasks } from "../store/tasksSlice";
import { tasksSlice } from "../store/tasksSlice";

function SearchBar() {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    // dispatch(searchTasks(query));
    dispatch(tasksSlice.actions.searchTasks(query));
  };

  return (
    <Form onSubmit={handleSearch} className="d-flex gap-2">
      <FormControl
        type="text"
        placeholder="Search tasks"
        className="mr-sm-2"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <Button variant="outline-success" type="submit">
        Search
      </Button>
    </Form>
  );
}

export default SearchBar;
