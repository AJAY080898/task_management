const Joi = require("joi");
CONFIG = require("../Configurations/config");

const loginInputValidation = (req, res, next) => {
	const loginSchema = Joi.object({
		email:Joi.string().email().required(),
		password: Joi.string().required(),
	});

	const validate = loginSchema.validate(req.body);
	if (validate.error) return next({ status: false, error: validate.error, errorCode: 400 })
	next();
}

module.exports = {
	loginInputValidation
}