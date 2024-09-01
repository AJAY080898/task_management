const TaskModel = require("./model");

const createTask = async (req) => {
  const user = req.user;

  const taskData = {
    title: req.body.title,
    userId: user.role === "ADMIN" ? req.body.userId : user.id,
    description: req.body.description,
    dueDate: req.body.dueDate,
    status: "PENDING",
  };

  await TaskModel(taskData).save();

  return { message: "Task created successfully" };
};

const getTaskList = async (req) => {

  const user = req.user;

  if(user.role === "ADMIN" && !req.query.userId) throw new Error("User id required in query")

  const userId = user.role === "ADMIN" ? req.query.userId : user.id;

  const userTasks = await TaskModel.find({ userId }).lean();

  return { message: "success", data: userTasks };
};

const getTaskById = async (req) => {
  const user = req.user;

  const { taskId } = req.params;

  const userId = user.role === "ADMIN" ? undefined : user.id;

  const userTask = await TaskModel.findOne({ _id: taskId ,userId }).lean();

  if (!userTask) throw new Error("Task not exist");

  return { message: "success", data: userTask };
};

const updateTask = async (req, res) => {
  const user = req.user;

  const { taskId } = req.params;

  const userTask = await TaskModel.findOne({ _id: taskId }).lean();

  if (!userTask) throw new Error("Task not exist");

  if(user.role !== "ADMIN" && userTask.userId?.toString() !== user.id)  throw new Error("You can't edit this task");

  const updateTaskData = {
    title: req.body.title,
    description: req.body.description,
    dueDate: req.body.dueDate,
    status: req.body.status,
  };

  await TaskModel.findOneAndUpdate({ _id: taskId }, updateTaskData).lean();

  return { data: "Updated successfully" };
};

const deleteTask = async (req, res) => {
  const user = req.user;

  const { taskId } = req.params;

  const userTask = await TaskModel.findOne({ _id: taskId }).lean();

  if (!userTask) throw new Error("Task not exist");

  if(user.role !== "ADMIN" && userTask.userId?.toString() !== user.id)  throw new Error("You can't delete this task");

  await TaskModel.findOneAndDelete({ _id: taskId }).lean();

  return { data: "Deleted successfully" };
};

module.exports = {
  createTask,
  getTaskList,
  updateTask,
  getTaskById,
  deleteTask,
};
