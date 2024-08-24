import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "./tasksSlice";
import notificationReducer from "./notificationSlice";

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    notification: notificationReducer,
  },
});
