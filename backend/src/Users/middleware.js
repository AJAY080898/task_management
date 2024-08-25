const Joi = require("joi");

const createAccountInputValidation = (req, res, next) => {
	const manageAccountSchema = Joi.object({
		name: Joi.string().required(),
		email: Joi.string().email().required(),
		password: Joi.string().required(),
	});

	const validate = manageAccountSchema.validate(req.body);
	if (validate.error) return next({ status: false, error: validate.error, errorCode: 400 })
	next();
}

const updateRoleInputValidation = (req, res, next) => {
	const updateRoleSchema = Joi.object({
		role: Joi.string().valid('ADMIN','USER').required(),
	});

	const validate = updateRoleSchema.validate(req.body);
	if (validate.error) return next({ status: false, error: validate.error, errorCode: 400 })
	next();
}

module.exports = {
	createAccountInputValidation,
	updateRoleInputValidation
}