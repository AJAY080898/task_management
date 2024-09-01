const express = require("express");
const taskService = require("./service");
const { createTaskInputValidation, updateTaskInputValidation } = require("./middleware");
const { authorizeRoute, isAdminUser } = require("../Authorize/authorize");
const router = express.Router();


router.post('/', [authorizeRoute, createTaskInputValidation], async (req, res, next) => {
	try {
		const result = await taskService.createTask(req, res)
		return res.status(201).send(result)
	} catch (error) {
		console.error("Error in create task ::", error);
		next(error)
	}
});

router.get('/', [authorizeRoute], async (req, res, next) => {
	try {
		const result = await taskService.getTaskList(req)
		return res.status(200).send(result)
	} catch (error) {
		console.error("Error in retriving task ::", error);
		next(error)
	}
});

router.get('/:taskId', [authorizeRoute], async (req, res, next) => {
	try {
		const result = await taskService.getTaskById(req)
		 return res.status(200).send(result)
	} catch (error) {
		next(error)
	}

});

router.put('/:taskId', [authorizeRoute, updateTaskInputValidation], async (req, res, next) => {
	try {
		const result = await taskService.updateTask(req)
		 return res.status(200).send(result)
	} catch (error) {
		console.error("Error in updating task ::", error);
		next(error)
	}

});

router.delete('/:taskId', [authorizeRoute], async (req, res, next) => {
	try {
		const result = await taskService.deleteTask(req);
		return res.status(200).send(result)
	} catch (error) {
		console.error("Error in deleting task ::", error);
		next(error)
	}
});

module.exports = router;