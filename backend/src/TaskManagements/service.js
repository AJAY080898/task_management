const TaskModel = require('./model');

const createTask = async (req) => {

	const taskData = {
		userId : req.user.id,
		title: req.body.title,
		description: req.body.description,
		dueDate: req.body.dueDate,
		status: "PENDING"
	}

	await TaskModel(taskData).save();

	return { message : "Task created successfully" }
}

const getTaskList = async (req) => {
	const user = req.user;

	const userTasks = await TaskModel.find({userId:user.id}).lean();

	return {message:"success", data: userTasks };
}

const updateTask = async (req, res) => {
	const user = req.user;

	const { taskId } = req.params;

	const userTask = await TaskModel.findOne({_id:taskId,userId:user.id,}).lean();

	if(!userTask) throw new Error("Task not exist")

	const updateTaskData = {
		userId : req.user.id,
		title: req.body.title,
		description: req.body.description,
		dueDate: req.body.dueDate,
		status: req.body.status
	}

	 await TaskModel.findOneAndUpdate({_id:taskId,userId:user.id,},updateTaskData).lean();

	return { data: "Updated successfully" };
}

const deleteTask = async (req, res) => {
	const user = req.user;

	const { taskId } = req.params;

	const userTask = await TaskModel.findOne({_id:taskId,userId:user.id,}).lean();

	if(!userTask) throw new Error("Task not exist")

	await TaskModel.findOneAndDelete({_id:taskId}).lean();

	return { data: "Deleted successfully" };
}

module.exports = {
	createTask,
	getTaskList,
	updateTask,
	deleteTask
}