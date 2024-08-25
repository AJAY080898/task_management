const express = require("express");
const userService = require("./service");
const { createAccountInputValidation, updateRoleInputValidation } = require("./middleware");
const { authorizeRoute, isAdminUser } = require("../Authorize/authorize");
const router = express.Router();


router.post('/signup', [createAccountInputValidation], async (req, res, next) => {
	try {
		const result = await userService.createNewUser(req, res);
		return res.status(201).send(result);
	} catch (error) {
		next(error)
	}
});

router.get('/', [authorizeRoute, isAdminUser], async (req, res, next) => {
	try {
		const result = await userService.getUserListForAdmin(req, res);
		return res.status(200).send(result);
	} catch (error) {
		next(error)
	}
});

router.put('/:userId', [authorizeRoute, isAdminUser, updateRoleInputValidation], async (req, res, next) => {
	try {
		const result = await userService.updateUserRole(req, res);
		return res.status(200).send(result);
	} catch (error) {
		next(error)
	}
});

router.get('/:userId', [authorizeRoute], async (req, res, next) => {
	try {
		const result = await userService.getUserProfileByUserId(req, res);
		return res.status(200).send(result);
	} catch (error) {
		next(error)
	}
});

module.exports = router;