const Joi = require("joi");

const createAccountInputValidation = (req, res, next) => {
	const manageAccountSchema = Joi.object({
		name: Joi.string().required(),
		email: Joi.string().email().required(),
		role: Joi.string(),
		password: Joi.string().required(),
	});

	const validate = manageAccountSchema.validate(req.body);
	if (validate.error) return next({ status: false, error: validate.error, errorCode: 400 })
	next();
}

module.exports = {
	createAccountInputValidation
}