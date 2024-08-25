const TaskModel = require('./model');

const createTask = async (req) => {

	const taskData = {
		title: req.body.title,
		description: req.body.description,
		dueDate: req.body.dueDate,
		status: "PENDING"
	}

	await TaskModel(taskData).save();

	return { message: "Task created successfully" }
}

const getTaskList = async (req) => {

	let userTasks = [];
	

	if(req.user.role === "ADMIN") {

	 userTasks = await TaskModel.find({}).lean();

	}

	return { message: "success", data: userTasks };
}

const getTaskById = async (req) => {

	const { taskId } = req.params;

	const userTask = await TaskModel.find({ _id: taskId }).lean();

	if (!userTask) throw new Error("Task not exist");

	return { message: "success", data: userTask };
}

const updateTask = async (req, res) => {

	const { taskId } = req.params;

	const userTask = await TaskModel.findOne({ _id: taskId }).lean();

	if (!userTask) throw new Error("Task not exist");

	const updateTaskData = {
		title: req.body.title,
		description: req.body.description,
		dueDate: req.body.dueDate,
		status: req.body.status
	}

	await TaskModel.findOneAndUpdate({ _id: taskId }, updateTaskData).lean();

	return { data: "Updated successfully" };
}

const deleteTask = async (req, res) => {

	const { taskId } = req.params;

	const userTask = await TaskModel.findOne({ _id: taskId, }).lean();

	if (!userTask) throw new Error("Task not exist")

	await TaskModel.findOneAndDelete({ _id: taskId }).lean();

	return { data: "Deleted successfully" };
}

module.exports = {
	createTask,
	getTaskList,
	updateTask,
	getTaskById,
	deleteTask
}