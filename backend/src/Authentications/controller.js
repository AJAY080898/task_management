const express = require("express");
const authenticationService = require("./service");
const { loginInputValidation } = require("./middleware");
const { authorizeRoute } = require("../Authorize/authorize");
const router = express.Router();

router.post('/login', [loginInputValidation], async (req, res, next) => {
	try {
		const result = await authenticationService.loginAccount(req, res);
		 return res.status(200).send(result);
	} catch (error) {
		next(error)
	}
});

router.delete('/logout', [authorizeRoute], async (req, res, next) => {
	try {
		const result = await authenticationService.logoutAccount(req, res);
		 return res.status(200).send(result);
	} catch (error) {
		next(error)
	}
});

module.exports = router;