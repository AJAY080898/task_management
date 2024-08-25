import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = () => {
  return axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Content-Type": "application/json",
    },
  });
};

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  let tasks;
  try {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const response = await api().get("/task");
    tasks = response.data.data;
  } catch (error) {
    console.error("Error fetching tasks", error);
    tasks = [];
  }
  return tasks;
});

export const addTask = createAsyncThunk("tasks/addTask", async (task) => {
  const response = await api().post("/task", task);
  return response.data;
});

export const fetchTaskDetails = createAsyncThunk(
  "tasks/fetchTaskDetails",
  async (id) => {
    const response = await api().get(`/task/${id}`);
    return response.data;
  }
);

export const deleteTask = createAsyncThunk("tasks/deleteTask", (id) => {
  api().delete(`/task/${id}`);
  return id;
});

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ id, task }) => {
    const response = await api().put(`/task/${id}`, task);
    return response.data;
  }
);

export const searchTasks = createAsyncThunk(
  "tasks/searchTasks",
  async (query) => {
    const response = await api().get(`/task?search=${query}`);
    return response.data.data;
  }
);

export const tasksSlice = createSlice({
  name: "tasks",
  initialState: {
    items: [],
    status: "idle",
    query: "",
    error: null,
  },
  reducers: {
    searchTasks: (state, action) => {
      state.query = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(fetchTaskDetails.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        } else {
          state.items.push(action.payload);
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((task) => task._id !== action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (task) => task._id === action.payload._id
        );
        state.items[index] = action.payload;
      })
      .addCase(searchTasks.fulfilled, (state, action) => {
        state.items = action.payload;
      });
  },
});

export default tasksSlice.reducer;
