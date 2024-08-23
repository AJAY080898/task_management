const errorHandler = (err, req, res, next) => {
	if (err.error?.details && err.error.details[0]?.message) {
		const errorMessage = err.error.details[0].message.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '')
		return res.status(400).send({ error: errorMessage })
	}
	else if (err.message) {
		return res.status(400).send({ error: err.message })
	};

	return res.status(500).send({ error: "Internal server error" })

};

module.exports = errorHandler