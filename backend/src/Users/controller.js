const express = require("express");
const userService = require("./service");
const { createAccountInputValidation } = require("./middleware");
const router = express.Router();


router.post('/signup', [createAccountInputValidation], async (req, res, next) => {
	try {
		const result = await userService.createNewUser(req, res);
		return res.status(201).send(result);
	} catch (error) {
		next(error)
	}
});

module.exports = router;